import { Request } from 'express';
import { IApiQueryParams } from '@topexam/api.lib.common';

export type IRequestWithAPIQueryParams = Request & {
  aqp?: IApiQueryParams;
};
