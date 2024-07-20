import { IQuery } from '@nestjs/cqrs';

export class GetQuestionGroupItemQuery implements IQuery {
  constructor(readonly questionGroupId: string) {}
}
