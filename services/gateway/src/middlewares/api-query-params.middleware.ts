import { Injectable, NestMiddleware } from '@nestjs/common';
import * as qs from 'qs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const qpm = require('query-params-mongo');

import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE_NUMBER } from './../constant';
import { IRequestWithAPIQueryParams } from '@/types';

@Injectable()
export class ApiQueryParamsMiddleware implements NestMiddleware {
  use(req: IRequestWithAPIQueryParams, _, next: () => void) {
    const pageSize = parseInt(
      (req.query.page_size || DEFAULT_PAGE_SIZE_NUMBER).toString(),
      10,
    );
    const page = parseInt(
      (req.query.page || DEFAULT_PAGE_NUMBER).toString(),
      10,
    );
    const pageToken = req.query.page_token?.toString();

    const queryFilter = qpm()(qs.parse(req.query.filter?.toString() ?? ''));
    const querySort = qpm()({
      __sort: req.query.sort,
    });

    req.aqp = {
      q: req.query.q?.toString() ?? '',
      filter: queryFilter.filter,
      sort: querySort.sort ?? {},
      pagination: { page_token: pageToken, page_size: pageSize },
      offset_pagination: { page: page, page_size: pageSize },
    };

    next();
  }
}
