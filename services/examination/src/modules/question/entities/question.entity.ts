import { AggregateRoot } from '@nestjs/cqrs';
import { QuestionCreatedEvent } from '../events/impl';

export class QuestionEntity extends AggregateRoot {
  constructor(readonly id: string) {
    super();
  }

  createQuestion(): void {
    this.apply(new QuestionCreatedEvent(this.id));
  }
}
