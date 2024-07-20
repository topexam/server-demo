import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ICommandResponse,
  RpcConflictException,
} from '@topexam/api.lib.common';

import { CreateCommentCommand } from './commands';
import { CreateCommentDTO } from './dto';
import { IQuestionWithLatestComment } from './types';
import {
  GetCommentListQuery,
  GetQuestionListWithLatestCommentQuery,
} from './queries';
import { ILeanCommentDocument } from './schemas';
import { QuestionService } from '@/modules/question';
import { ExaminationService } from '@/modules/examination';

@Injectable()
export class CommentService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly questionSrv: QuestionService,
    private readonly examinationSrv: ExaminationService,
  ) {}

  async getCommentList(questionId: string): Promise<ILeanCommentDocument[]> {
    await this._checkQuestionExisted(questionId);

    return this.queryBus.execute(new GetCommentListQuery(questionId));
  }

  async getQuestionListWithLatestComment(
    examinationId: string,
  ): Promise<IQuestionWithLatestComment[]> {
    await this._getExaminationItem(examinationId);

    return this.queryBus.execute(
      new GetQuestionListWithLatestCommentQuery(examinationId),
    );
  }

  async createComment(
    questionId: string,
    reviewerId: string,
    createCommentDTO: CreateCommentDTO,
  ): Promise<ICommandResponse> {
    await this._checkQuestionExisted(questionId);

    return this.commandBus.execute(
      new CreateCommentCommand(questionId, reviewerId, createCommentDTO),
    );
  }

  private async _checkQuestionExisted(questionId: string) {
    const item = await this.questionSrv.getQuestionItem(questionId);
    if (!item) throw new RpcConflictException();

    return item;
  }

  private async _getExaminationItem(examinationId: string) {
    const item = this.examinationSrv.getExaminationItem(examinationId);
    if (!item) throw new RpcConflictException();

    return item;
  }
}
