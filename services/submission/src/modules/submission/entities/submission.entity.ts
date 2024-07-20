import { AggregateRoot } from '@nestjs/cqrs';
import {
  TakingExaminationStartedEvent,
  TakingExaminationSubmittedEvent,
} from '../events/impl';

export class SubmissionEntity extends AggregateRoot {
  constructor(readonly id: string) {
    super();
  }

  startTakingExamination(submissionId: string, examinationId: string): void {
    this.apply(new TakingExaminationStartedEvent(submissionId, examinationId));
  }

  submitTakingExamination(submissionId: string): void {
    this.apply(new TakingExaminationSubmittedEvent(submissionId));
  }
}
