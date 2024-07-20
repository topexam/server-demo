import { IQuery } from '@nestjs/cqrs';
import { IApiQueryParams } from '@topexam/api.lib.common';

export class GetExaminationListRecommendedQuery implements IQuery {
  constructor(readonly userId: string, readonly aqp: IApiQueryParams) {}
}
