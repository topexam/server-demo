import { IEvent } from '@nestjs/cqrs';

export class CategoryCreatedEvent implements IEvent {
  constructor(public readonly categoryId: string) {}
}