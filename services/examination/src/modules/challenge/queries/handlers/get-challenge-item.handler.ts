import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { ChallengeRepository } from '../../repositories';
import { ILeanChallengeDocument } from '../../schemas';
import { GetChallengeItemQuery } from '../impl';

@QueryHandler(GetChallengeItemQuery)
export class GetChallengeItemHandler
  implements IQueryHandler<GetChallengeItemQuery>
{
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  async execute(query: GetChallengeItemQuery): Promise<ILeanChallengeDocument> {
    Logger.log('Async GetChallengeItemQuery...', 'GetChallengeItemHandler');
    const { challengeId, userId } = query;
    return this.challengeRepository.getChallengeItem(challengeId, userId);
  }
}
