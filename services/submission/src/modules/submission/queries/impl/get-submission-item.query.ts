import { IQuery } from '@nestjs/cqrs';

export class GetSubmissionItemQuery implements IQuery {
  constructor(readonly submissionId: string) {}
}
