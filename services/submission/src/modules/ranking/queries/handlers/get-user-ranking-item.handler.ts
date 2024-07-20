import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { IExaminationRanking } from '../../types';
import { ExaminationRankingRepository } from '../../repositories';
import { GetUserRankingItemQuery } from '../impl';

@QueryHandler(GetUserRankingItemQuery)
export class GetUserRankingItemHandler
  implements IQueryHandler<GetUserRankingItemQuery>
{
  constructor(
    private readonly examinationRankingRepository: ExaminationRankingRepository,
  ) {}

  async execute(query: GetUserRankingItemQuery): Promise<IExaminationRanking> {
    Logger.log('Async GetUserRankingItemQuery...', 'GetUserRankingItemHandler');
    const { examinationId, playerId } = query;
    return this.examinationRankingRepository.getUserRankingItem(
      examinationId,
      playerId,
    );
  }
}
