import { AggregateRoot } from '@nestjs/cqrs';
import { FileCreatedEvent } from '../events/impl';

export class FileEntity extends AggregateRoot {
  constructor(readonly id: string) {
    super();
  }

  createFile(): void {
    this.apply(new FileCreatedEvent(this.id));
  }
}
