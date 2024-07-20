import { IEvent } from "@nestjs/cqrs";

export class ReviewCreatedEvent implements IEvent {
  constructor(
    public readonly reviewId: string
  ) {}
}