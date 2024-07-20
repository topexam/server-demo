import { IEvent } from '@nestjs/cqrs';

export class TakingExaminationStartedEvent implements IEvent {
  constructor(
    public readonly submissionId: string,
    public readonly examinationId: string,
  ) {}
}
