import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { ReviewRepository } from '../../repositories';
import { ILeanReviewDocument } from '../../schemas';
import { GetReviewItemQuery } from '../impl';

@QueryHandler(GetReviewItemQuery)
export class GetReviewItemHandler implements IQueryHandler<GetReviewItemQuery> {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(query: GetReviewItemQuery): Promise<ILeanReviewDocument> {
    Logger.log('Async GetReviewItemQuery...', 'GetReviewItemHandler');
    const { reviewId, userId } = query;
    return this.reviewRepository.getReviewItem(reviewId, userId);
  }
}
