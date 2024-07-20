import { IQuery } from '@nestjs/cqrs';

export class GetDefaultQuestionGroupQuery implements IQuery {
  constructor(readonly examinationId: string) {}
}
