import { AggregateRoot } from '@nestjs/cqrs';

export class QuestionGroupEntity extends AggregateRoot {
  constructor(readonly id: string) {
    super();
  }
}
