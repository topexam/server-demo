import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CreateReviewCommand } from '../impl';
import { ReviewRepository } from '../../repositories';

@CommandHandler(CreateReviewCommand)
export class CreateReviewHandler
  implements ICommandHandler<CreateReviewCommand>
{
  constructor(
    private readonly repository: ReviewRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateReviewCommand): Promise<any> {
    Logger.log('Async CreateReviewHandler...', 'CreateReviewCommand');
    const { examinationId, userId, createReviewDTO } = command;
    const review = this.publisher.mergeObjectContext(
      await this.repository.createReview(
        examinationId,
        userId,
        createReviewDTO,
      ),
    );

    review.createReview();
    review.commit();

    return { id: review.id, success: true };
  }
}
