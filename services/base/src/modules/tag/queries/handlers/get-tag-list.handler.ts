import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { TagRepository } from '../../repositories';
import { ILeanTagDocument } from '../../schemas';
import { GetTagListQuery } from '../impl';

@QueryHandler(GetTagListQuery)
export class GetTagListHandler implements IQueryHandler<GetTagListQuery> {
  constructor(private readonly tagRepository: TagRepository) {}

  async execute(query: GetTagListQuery): Promise<ILeanTagDocument[]> {
    Logger.log('Async GetTagListQuery...', 'GetTagListHandler');
    const TagList = await this.tagRepository.getTagList(query.aqp);
    return TagList;
  }
}
