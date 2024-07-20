import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  IApiQueryParams,
  ICommandResponse,
  RpcNotFoundException,
} from '@topexam/api.lib.common';

import { ECommandAction } from '@/enums';
import { ExaminationService } from '@/modules/examination';
import {
  CreateQuestionCommand,
  UpdateQuestionCommand,
  RemoveQuestionCommand,
  CreateBulkQuestionCommand,
} from '../commands';
import {
  CreateBulkQuestionDTO,
  CreateQuestionDTO,
  UpdateQuestionDTO,
} from '../dto';
import {
  GetFileQuestionListQuery,
  GetQuestionItemQuery,
  GetQuestionListQuery,
} from '../queries';
import {
  ILeanFileQuestionDocument,
  ILeanNormalQuestionDocument,
} from '../schemas';
import { QuestionGroupService } from './question-group.service';

@Injectable()
export class QuestionService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(forwardRef(() => ExaminationService))
    private readonly examinationSrv: ExaminationService,
    private readonly questionGroupSrv: QuestionGroupService,
  ) {}

  async getQuestionList(
    examinationId: string,
    hasAnswer = false,
    aqp?: IApiQueryParams,
  ): Promise<ILeanNormalQuestionDocument[]> {
    return this.queryBus.execute(
      new GetQuestionListQuery(examinationId, hasAnswer, aqp),
    );
  }

  async getFileQuestionList(
    examinationId: string,
    hasAnswer = false,
    aqp: IApiQueryParams,
  ): Promise<ILeanFileQuestionDocument[]> {
    return this.queryBus.execute(
      new GetFileQuestionListQuery(examinationId, hasAnswer, aqp),
    );
  }

  async getQuestionItem(
    questionId: string,
  ): Promise<ILeanNormalQuestionDocument> {
    return this._getQuestionItem(questionId);
  }

  async createQuestion(
    examinationId: string,
    createQuestionDTO: CreateQuestionDTO,
  ): Promise<any> {
    const response = await this.commandBus.execute(
      new CreateQuestionCommand(examinationId, createQuestionDTO),
    );
    await this.examinationSrv.updateQuestionNumberForExamination(
      examinationId,
      ECommandAction.ADDED,
    );

    return response;
  }

  async createBulkQuestion(
    examinationId: string,
    createBulkQuestionDTO: CreateBulkQuestionDTO,
  ): Promise<any> {
    const defaultQuestionGroup = await this.questionGroupSrv.getDefaultGroup(
      examinationId,
    );
    const transformedDTO = {
      ...createBulkQuestionDTO,
      questions: createBulkQuestionDTO.questions?.map((it) => ({
        ...it,
        question_group_id: defaultQuestionGroup._id,
        examination_id: examinationId,
      })),
    };
    const response = await this.commandBus.execute(
      new CreateBulkQuestionCommand(transformedDTO),
    );

    return response;
  }

  async updateQuestion(
    questionId: string,
    updateQuestionDTO: UpdateQuestionDTO,
  ): Promise<ICommandResponse> {
    await this._getQuestionItem(questionId);

    return this.commandBus.execute(
      new UpdateQuestionCommand(questionId, updateQuestionDTO),
    );
  }

  async removeQuestion(questionId: string): Promise<any> {
    const question = await this._getQuestionItem(questionId);

    const response = await this.commandBus.execute(
      new RemoveQuestionCommand(questionId),
    );
    await this.examinationSrv.updateQuestionNumberForExamination(
      question.examination_id,
      ECommandAction.REMOVED,
    );

    return response;
  }

  private async _getQuestionItem(
    questionId: string,
  ): Promise<ILeanNormalQuestionDocument> {
    const item = await this.queryBus.execute(
      new GetQuestionItemQuery(questionId),
    );
    if (!item) throw new RpcNotFoundException();

    return item;
  }
}
