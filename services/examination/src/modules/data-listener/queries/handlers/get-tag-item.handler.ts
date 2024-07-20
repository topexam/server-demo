import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { TagRepository } from '../../repositories';
import { ILeanTagDocument } from '../../schemas';
import { GetTagItemQuery } from '../impl';

@QueryHandler(GetTagItemQuery)
export class GetTagItemHandler implements IQueryHandler<GetTagItemQuery> {
  constructor(private readonly tagRepository: TagRepository) {}

  async execute(query: GetTagItemQuery): Promise<ILeanTagDocument> {
    Logger.log('Async GetTagItemQuery...', 'GetTagItemHandler');
    const { tagId } = query;
    return this.tagRepository.getTagItem(tagId);
  }
}
