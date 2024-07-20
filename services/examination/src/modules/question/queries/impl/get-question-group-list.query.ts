import { IQuery } from '@nestjs/cqrs';
import { IApiQueryParams } from '@topexam/api.lib.common';

export class GetQuestionGroupListQuery implements IQuery {
  constructor(readonly examinationId: string, readonly aqp: IApiQueryParams) {}
}
