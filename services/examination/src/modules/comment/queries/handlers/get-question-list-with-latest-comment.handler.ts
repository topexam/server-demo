import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { IQuestionWithLatestComment } from '../../types';
import { CommentRepository } from '../../repositories';
import { GetQuestionListWithLatestCommentQuery } from '../impl';

@QueryHandler(GetQuestionListWithLatestCommentQuery)
export class GetQuestionListWithLatestCommentHandler
  implements IQueryHandler<GetQuestionListWithLatestCommentQuery>
{
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(
    query: GetQuestionListWithLatestCommentQuery,
  ): Promise<IQuestionWithLatestComment[]> {
    Logger.log(
      'Async GetQuestionListWithLatestCommentQuery...',
      'GetQuestionListWithLatestCommentHandler',
    );
    const { examinationId } = query;
    return this.commentRepository.getQuestionListWithLatestComment(
      examinationId,
    );
  }
}
