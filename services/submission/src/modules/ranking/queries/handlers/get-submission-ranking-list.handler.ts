import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { ExaminationRankingRepository } from '../../repositories';
import { IExaminationRanking } from '../../types';
import { GetSubmissionRankingListQuery } from '../impl';

@QueryHandler(GetSubmissionRankingListQuery)
export class GetSubmissionRankingListHandler
  implements IQueryHandler<GetSubmissionRankingListQuery>
{
  constructor(
    private readonly examinationRankingRepository: ExaminationRankingRepository,
  ) {}

  async execute(
    query: GetSubmissionRankingListQuery,
  ): Promise<IExaminationRanking[]> {
    Logger.log(
      'Async GetSubmissionRankingListQuery...',
      'GetSubmissionRankingListHandler',
    );
    const { examinationId } = query;
    return this.examinationRankingRepository.getSubmissionRankingList(
      examinationId,
    );
  }
}
