import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { CategoryRepository } from '../../repositories';
import { ILeanCategoryDocument } from '../../schemas';
import { GetCategoryListQuery } from '../impl';

@QueryHandler(GetCategoryListQuery)
export class GetCategoryListHandler
  implements IQueryHandler<GetCategoryListQuery>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(query: GetCategoryListQuery): Promise<ILeanCategoryDocument[]> {
    Logger.log('Async GetCategoryListQuery...', 'GetCategoryListHandler');
    return this.categoryRepository.getCategoryList(query.aqp);
  }
}
