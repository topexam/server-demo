import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../repositories';
import { ILeanUserDocument } from '../../schemas';
import { GetUserItemQuery } from '../impl';

@QueryHandler(GetUserItemQuery)
export class GetUserItemHandler implements IQueryHandler<GetUserItemQuery> {
  constructor(private readonly tagRepository: UserRepository) {}

  async execute(query: GetUserItemQuery): Promise<ILeanUserDocument> {
    Logger.log('Async GetUserItemQuery...', 'GetUserItemHandler');
    const { userId } = query;
    return this.tagRepository.getUserItem(userId);
  }
}
