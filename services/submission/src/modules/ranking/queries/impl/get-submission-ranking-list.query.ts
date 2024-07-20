import { IQuery } from '@nestjs/cqrs';

export class GetSubmissionRankingListQuery implements IQuery {
  constructor(readonly examinationId: string) {}
}
