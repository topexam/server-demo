import { AggregateRoot } from '@nestjs/cqrs';

import {
  ExaminationCreatedEvent,
  ExaminationPublishedEvent,
} from '../events/impl';

export class ExaminationEntity extends AggregateRoot {
  constructor(readonly id: string) {
    super();
  }

  createExamination(): void {
    this.apply(new ExaminationCreatedEvent(this.id));
  }

  publishExamination(): void {
    this.apply(new ExaminationPublishedEvent(this.id));
  }
}
