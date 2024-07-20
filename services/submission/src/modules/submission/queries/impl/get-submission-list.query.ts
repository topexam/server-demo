import { IQuery } from '@nestjs/cqrs';
import { IApiQueryParams } from '@topexam/api.lib.common';

export class GetSubmissionListQuery implements IQuery {
  constructor(readonly aqp: IApiQueryParams) {}
}
