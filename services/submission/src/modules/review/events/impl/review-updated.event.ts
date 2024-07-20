import { IEvent } from "@nestjs/cqrs";

export class ReviewUpdatedEvent implements IEvent {
  constructor(
    public readonly reviewId: string,
    public readonly oldReview: number
  ) {}
}