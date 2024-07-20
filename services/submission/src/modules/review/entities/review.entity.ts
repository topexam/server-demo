import { AggregateRoot } from '@nestjs/cqrs';
import { ReviewCreatedEvent, ReviewUpdatedEvent } from '../events/impl';

export class ReviewEntity extends AggregateRoot {
  constructor(readonly id: string) {
    super();
  }

  createReview(): void {
    this.apply(new ReviewCreatedEvent(this.id));
  }

  updateReview(oldReview: number): void {
    this.apply(new ReviewUpdatedEvent(this.id, oldReview));
  }
}
