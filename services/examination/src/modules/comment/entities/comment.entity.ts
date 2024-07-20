import { AggregateRoot } from '@nestjs/cqrs';
import { CommentCreatedEvent } from '../events/impl';

export class CommentEntity extends AggregateRoot {
  constructor(readonly id: string) {
    super();
  }

  createComment(): void {
    this.apply(new CommentCreatedEvent(this.id));
  }
}
