import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { SubmissionRepository } from '../../repositories';
import { ILeanSubmissionDocument } from '../../schemas';
import { GetSubmissionListQuery } from '../impl';

@QueryHandler(GetSubmissionListQuery)
export class GetSubmissionListHandler
  implements IQueryHandler<GetSubmissionListQuery>
{
  constructor(private readonly submissionRepository: SubmissionRepository) {}

  async execute(
    query: GetSubmissionListQuery,
  ): Promise<ILeanSubmissionDocument[]> {
    Logger.log('Async GetSubmissionListQuery...', 'GetSubmissionListHandler');
    const { aqp } = query;
    return this.submissionRepository.getSubmissionList(aqp);
  }
}
