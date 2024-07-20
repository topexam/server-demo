import { IQuery } from '@nestjs/cqrs';

export class GetQuestionItemQuery implements IQuery {
  constructor(readonly questionId: string) {}
}
