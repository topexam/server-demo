import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { ChallengeRepository } from '../../repositories';
import { ILeanChallengeDocument } from '../../schemas';
import { GetChallengeListQuery } from '../impl';

@QueryHandler(GetChallengeListQuery)
export class GetChallengeListHandler
  implements IQueryHandler<GetChallengeListQuery>
{
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(
    query: GetChallengeListQuery,
  ): Promise<ILeanChallengeDocument[]> {
    Logger.log('Async GetChallengeListQuery...', 'GetChallengeListHandler');
    const { aqp } = query;
    return this.challengeRepository.getChallengeList(aqp);
  }
}
