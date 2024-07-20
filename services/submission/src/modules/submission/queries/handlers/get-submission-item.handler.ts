import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { SubmissionRepository } from '../../repositories';
import { ILeanSubmissionDocument } from '../../schemas';
import { GetSubmissionItemQuery } from '../impl';

@QueryHandler(GetSubmissionItemQuery)
export class GetSubmissionItemHandler
  implements IQueryHandler<GetSubmissionItemQuery>
{
  constructor(private readonly submissionRepository: SubmissionRepository) {}

  async execute(
    query: GetSubmissionItemQuery,
  ): Promise<ILeanSubmissionDocument> {
    Logger.log('Async GetSubmissionItemQuery...', 'GetSubmissionItemHandler');
    const { submissionId } = query;

    return this.submissionRepository.getSubmissionItem(submissionId);
  }
}
