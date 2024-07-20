import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { IExaminationRanking } from './types';
import {
  GetSubmissionRankingListQuery,
  GetUserRankingItemQuery,
} from './queries';

@Injectable()
export class ExaminationRankingService {
  constructor(private readonly queryBus: QueryBus) {}

  async getRankingListByExamination(
    examinationId: string,
  ): Promise<IExaminationRanking[]> {
    return this.queryBus.execute(
      new GetSubmissionRankingListQuery(examinationId),
    );
  }

  async getUserRankingByExamination(
    examinationId: string,
    playerId: string,
  ): Promise<IExaminationRanking> {
    return this.queryBus.execute(
      new GetUserRankingItemQuery(examinationId, playerId),
    );
  }
}
