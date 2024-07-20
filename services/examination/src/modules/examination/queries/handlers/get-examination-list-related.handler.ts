import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { ExaminationRepository } from '../../repositories';
import { ILeanExaminationDocument } from '../../schemas';
import { GetExaminationListRelatedQuery } from '../impl';

@QueryHandler(GetExaminationListRelatedQuery)
export class GetExaminationListRelatedHandler
  implements IQueryHandler<GetExaminationListRelatedQuery>
{
  constructor(private readonly examinationRepository: ExaminationRepository) {}

  async execute(
    query: GetExaminationListRelatedQuery,
  ): Promise<ILeanExaminationDocument[]> {
    Logger.log(
      'Async GetExaminationListRelatedQuery...',
      'GetExaminationListRelatedHandler',
    );
    const examinationList =
      await this.examinationRepository.getExaminationListRelated(
        query.examinationId,
        query.aqp,
      );
    return examinationList;
  }
}
