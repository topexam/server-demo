import { IEvent } from '@nestjs/cqrs';

export class QuestionCreatedEvent implements IEvent {
  constructor(public readonly questionId: string) {}
}
