import { IEvent } from '@nestjs/cqrs';

export class FileCreatedEvent implements IEvent {
  constructor(public readonly fileId: string) {}
}
