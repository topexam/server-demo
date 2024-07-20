import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { CommentRepository } from '../../repositories';
import { ILeanCommentDocument } from '../../schemas';
import { GetCommentListQuery } from '../impl';

@QueryHandler(GetCommentListQuery)
export class GetCommentListHandler
  implements IQueryHandler<GetCommentListQuery>
{
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(query: GetCommentListQuery): Promise<ILeanCommentDocument[]> {
    Logger.log('Async GetCommentListQuery...', 'GetCommentListHandler');
    const { questionId } = query;
    return this.commentRepository.getCommentList(questionId);
  }
}
