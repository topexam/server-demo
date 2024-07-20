import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { ExaminationRepository } from '../../repositories';
import { ILeanExaminationDocument } from '../../schemas';
import { GetExaminationListRecommendedQuery } from '../impl';

@QueryHandler(GetExaminationListRecommendedQuery)
export class GetExaminationListRecommendedHandler
  implements IQueryHandler<GetExaminationListRecommendedQuery>
{
  constructor(private readonly examinationRepository: ExaminationRepository) {}

  async execute(
    query: GetExaminationListRecommendedQuery,
  ): Promise<ILeanExaminationDocument[]> {
    Logger.log(
      'Async GetExaminationListRecommendedQuery...',
      'GetExaminationListRecommendedHandler',
    );
    const examinationList =
      await this.examinationRepository.getExaminationListRecommended(
        query.userId,
        query.aqp,
      );
    return examinationList;
  }
}
