import { IQuery } from '@nestjs/cqrs';
import { IApiQueryParams } from '@topexam/api.lib.common';

export class GetQuestionListQuery implements IQuery {
  constructor(
    readonly examinationId: string,
    readonly hasAnswer: boolean,
    readonly aqp: IApiQueryParams,
  ) {}
}