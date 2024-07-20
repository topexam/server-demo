import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { UpdateReviewCommand } from '../impl';
import { ReviewRepository } from '../../repositories';

@CommandHandler(UpdateReviewCommand)
export class UpdateReviewHandler
  implements ICommandHandler<UpdateReviewCommand>
{
  constructor(
    private readonly repository: ReviewRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateReviewCommand): Promise<any> {
    Logger.log('Async UpdateReviewHandler...', 'UpdateReviewCommand');
    const { reviewId, userId, updateReviewDTO } = command;

    const reviewItem = await this.repository.getReviewItem(reviewId, userId);
    const review = this.publisher.mergeObjectContext(
      await this.repository.updateReview(reviewId, userId, updateReviewDTO),
    );

    review.updateReview(reviewItem.rating);
    review.commit();

    return { id: review.id, success: true };
  }
}
