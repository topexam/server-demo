import { IEvent } from '@nestjs/cqrs';

export class TakingExaminationSubmittedEvent implements IEvent {
  constructor(public readonly submissionId: string) {}
}
