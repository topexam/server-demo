import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { ExaminationRepository } from '../../repositories';
import { ILeanExaminationDocument } from '../../schemas';
import { GetExaminationItemQuery } from '../impl';

@QueryHandler(GetExaminationItemQuery)
export class GetExaminationItemHandler
  implements IQueryHandler<GetExaminationItemQuery>
{
  constructor(private readonly examinationRepository: ExaminationRepository) {}

  async execute(
    query: GetExaminationItemQuery,
  ): Promise<ILeanExaminationDocument> {
    Logger.log('Async GetExaminationItemQuery...', 'GetExaminationItemHandler');
    const { examinationId } = query;
    return this.examinationRepository.getExaminationItem(examinationId);
  }
}
