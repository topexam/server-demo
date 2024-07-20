import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { ReviewRepository } from '../../repositories';
import { ILeanReviewDocument } from '../../schemas';
import { GetReviewListQuery } from '../impl';

@QueryHandler(GetReviewListQuery)
export class GetReviewListHandler implements IQueryHandler<GetReviewListQuery> {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(query: GetReviewListQuery): Promise<ILeanReviewDocument[]> {
    Logger.log('Async GetReviewListQuery...', 'GetReviewListHandler');
    const { examinationId } = query;
    return this.reviewRepository.getReviewList(examinationId);
  }
}
