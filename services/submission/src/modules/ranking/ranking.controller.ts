import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import {
  CustomRpcExceptionFilter,
  IQueryResponse,
  RpcNotFoundException,
  TransformInterceptor,
} from '@topexam/api.lib.common';
import {
  GetSubmissionRankingListRequest,
  GetUserRankingItemRequest,
  RankingServiceController,
  RankingServiceControllerMethods,
} from '@topexam/api.service.proto/dist/__generated__/ranking.pb';

import { IExaminationRanking } from './types';
import { ExaminationRankingService } from './ranking.service';
import {
  DataListenerService,
  IExaminationDocument,
} from '@/modules/data-listener';

@UseInterceptors(new TransformInterceptor())
@UseFilters(new CustomRpcExceptionFilter())
@Controller()
@RankingServiceControllerMethods()
export class ExaminationRankingController implements RankingServiceController {
  constructor(
    private readonly examinationRankingSrv: ExaminationRankingService,
    private readonly dataListenerSrv: DataListenerService,
  ) {}

  async getSubmissionRankingList(request: GetSubmissionRankingListRequest) {
    await this._getExaminationItem(
      request.examinationId,
    );
    const rankingList =
      await this.examinationRankingSrv.getRankingListByExamination(
        request.examinationId,
      );

    return {
      data: rankingList,
      meta: {
        next_page_token: null,
        total: 0,
      },
    };
  }

  async getUserRankingItem(
    request: GetUserRankingItemRequest,
  ): Promise<IQueryResponse<IExaminationRanking>> {
    await this._getExaminationItem(request.examinationId);
    const rankingItem =
      await this.examinationRankingSrv.getUserRankingByExamination(
        request.examinationId,
        request.userId,
      );

    return { data: rankingItem };
  }

  async _getExaminationItem(
    examinationId: string,
  ): Promise<IExaminationDocument> {
    const item = await this.dataListenerSrv.getExaminationItem(examinationId);
    if (!item) throw new RpcNotFoundException();

    return item;
  }
}
