import { IEvent } from '@nestjs/cqrs';

export class CommentCreatedEvent implements IEvent {
  constructor(public readonly commentId: string) {}
}
