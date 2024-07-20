import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  IDataReviewCreatedEvent,
  IDataReviewUpdatedEvent,
  IDataExaminationSubmittedEvent,
  ESubjectPattern,
  ICommandResponse,
} from '@topexam/api.lib.common';
import { IApiQueryParams } from '@topexam/api.lib.common';

import { ECommandAction } from '@/enums';
import { QuestionService } from '@/modules/question';
import {
  CreateExaminationCommand,
  DeleteExaminationCommand,
  UpdateExaminationCommand,
  UpdateQuestionNumForExaminationCommand,
  CreateQuestionListFromFileCommand,
  GenerateExaminationPDFCommand,
  PublishExaminationCommand,
  CountExaminationPropertyCommand,
  UpdateExaminationRatingCommand,
} from './commands';
import { CreateExaminationDTOWithAuthor, UpdateExaminationDTO } from './dto';
import {
  GetExaminationItemQuery,
  GetExaminationListQuery,
  GetExaminationListRecommendedQuery,
  GetExaminationListRelatedQuery,
} from './queries';
import { ILeanExaminationDocument } from './schemas';
import { ECountPropertyKey } from './enums';
import { convertListToLinkList } from './utils';
import { CreateQuestionListFromFileDTO } from './dto';

@Injectable()
export class ExaminationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(forwardRef(() => QuestionService))
    private readonly questionSrv: QuestionService,
  ) {}

  async getExaminationList(
    aqp: IApiQueryParams,
  ): Promise<ILeanExaminationDocument[]> {
    return this.queryBus.execute(new GetExaminationListQuery(aqp));
  }

  async getExaminationListRecommended(
    userId: string,
    aqp: IApiQueryParams,
  ): Promise<ILeanExaminationDocument[]> {
    return this.queryBus.execute(
      new GetExaminationListRecommendedQuery(userId, aqp),
    );
  }

  async getExaminationListRelated(
    examinationId: string,
    aqp: IApiQueryParams,
  ): Promise<ILeanExaminationDocument[]> {
    return this.queryBus.execute(
      new GetExaminationListRelatedQuery(examinationId, aqp),
    );
  }

  async getExaminationItem(
    examinationId: string,
  ): Promise<ILeanExaminationDocument> {
    return this.queryBus.execute(new GetExaminationItemQuery(examinationId));
  }

  async getExaminationItemWithExtraData(
    examinationId: string,
  ): Promise<ILeanExaminationDocument> {
    const examinationItem = await this.queryBus.execute(
      new GetExaminationItemQuery(examinationId),
    );
    const questions = await this.questionSrv.getQuestionList(examinationId);
    const questionTransformed = convertListToLinkList(questions, []).reverse();

    return {
      ...examinationItem,
      questions: questionTransformed,
    };
  }

  async generateExaminationPDF(examinationId: string): Promise<Buffer> {
    return this.commandBus.execute(
      new GenerateExaminationPDFCommand(examinationId),
    );
  }

  async createExamination(
    createExaminationDTOWithAuthor: CreateExaminationDTOWithAuthor,
  ): Promise<ICommandResponse> {
    return this.commandBus.execute(
      new CreateExaminationCommand(createExaminationDTOWithAuthor),
    );
  }

  async updateExamination(
    examinationId: string,
    updateExaminationDTO: UpdateExaminationDTO,
  ): Promise<ICommandResponse> {
    return this.commandBus.execute(
      new UpdateExaminationCommand(examinationId, updateExaminationDTO),
    );
  }

  async createQuestionListFromFile(
    examinationId: string,
    createQuestionListFromFileDTO: CreateQuestionListFromFileDTO,
  ): Promise<ICommandResponse> {
    return this.commandBus.execute(
      new CreateQuestionListFromFileCommand(
        examinationId,
        createQuestionListFromFileDTO,
      ),
    );
  }

  async updateQuestionNumberForExamination(
    examinationId: string,
    action: ECommandAction,
  ): Promise<ICommandResponse> {
    return this.commandBus.execute(
      new UpdateQuestionNumForExaminationCommand(examinationId, action),
    );
  }

  async deleteExamination(examinationId: string): Promise<ICommandResponse> {
    return this.commandBus.execute(new DeleteExaminationCommand(examinationId));
  }

  async publishExamination(examinationId: string): Promise<ICommandResponse> {
    return this.commandBus.execute(
      new PublishExaminationCommand(examinationId),
    );
  }

  async countProperty(
    examinationId: string,
    countPropertyKey: ECountPropertyKey,
  ): Promise<ICommandResponse> {
    return this.commandBus.execute(
      new CountExaminationPropertyCommand(examinationId, countPropertyKey),
    );
  }

  async updateExaminationRating(
    examinationId: string,
    resultRating: number,
  ): Promise<ICommandResponse> {
    return this.commandBus.execute(
      new UpdateExaminationRatingCommand(examinationId, resultRating),
    );
  }

  @EventPattern(ESubjectPattern.ExaminationSubmitted)
  async examinationSubmittedHandler(
    @Payload() data: IDataExaminationSubmittedEvent['data'],
  ): Promise<void> {
    Logger.log(
      `Received message / ${
        ESubjectPattern.ExaminationSubmitted
      } with payload: ${JSON.stringify(data)}`,
      'examinationSubmittedHandler',
    );
    await this.countProperty(
      data.examinationId,
      ECountPropertyKey.SUBMITTED_NUM,
    );

    Logger.log('SUCCESS');
  }

  @EventPattern(ESubjectPattern.ReviewCreated)
  async reviewCreatedHandler(
    @Payload() data: IDataReviewCreatedEvent['data'],
  ): Promise<void> {
    Logger.log(
      `Received message / ${
        ESubjectPattern.ReviewCreated
      } with payload: ${JSON.stringify(data)}`,
      'reviewCreatedHandler',
    );
    const { examinationId, rating } = data;
    const examination = await this.getExaminationItem(examinationId);
    if (!examination) throw new NotFoundException();

    const resultRating =
      (examination.rating * examination.review_count + rating) /
        examination.review_count +
      1;
    await this.updateExaminationRating(data.examinationId, resultRating);

    await this.countProperty(data.examinationId, ECountPropertyKey.REVIEW_NUM);

    Logger.log('SUCCESS');
  }

  @EventPattern(ESubjectPattern.ReviewUpdated)
  async reviewUpdatedHandler(
    @Payload() data: IDataReviewUpdatedEvent['data'],
  ): Promise<void> {
    Logger.log(
      `Received message / ${
        ESubjectPattern.ReviewUpdated
      } with payload: ${JSON.stringify(data)}`,
      'reviewUpdatedHandler',
    );
    const { examinationId, oldRating, newRating } = data;
    const examination = await this.getExaminationItem(examinationId);
    if (!examination) throw new NotFoundException();

    const resultRating =
      (examination.rating * examination.review_count - oldRating + newRating) /
      examination.review_count;
    await this.updateExaminationRating(data.examinationId, resultRating);

    Logger.log('SUCCESS');
  }
}
