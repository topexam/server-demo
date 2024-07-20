import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { ExaminationRepository } from '../../repositories';
import { ILeanExaminationDocument } from '../../schemas';
import { GetExaminationListQuery } from '../impl';

@QueryHandler(GetExaminationListQuery)
export class GetExaminationListHandler
  implements IQueryHandler<GetExaminationListQuery>
{
  constructor(private readonly examinationRepository: ExaminationRepository) {}

  async execute(
    query: GetExaminationListQuery,
  ): Promise<ILeanExaminationDocument[]> {
    Logger.log('Async GetExaminationListQuery...', 'GetExaminationListHandler');
    const { aqp } = query;
    return this.examinationRepository.getExaminationList(aqp);
  }
}
