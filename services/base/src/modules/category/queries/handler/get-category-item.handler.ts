import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ILeanCategoryDocument } from '../../schemas';
import { GetCategoryItemQuery } from '../impl';
import { CategoryRepository } from '../../repositories';

@QueryHandler(GetCategoryItemQuery)
export class GetCategoryItemHandler
  implements IQueryHandler<GetCategoryItemQuery>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(query: GetCategoryItemQuery): Promise<ILeanCategoryDocument> {
    Logger.log('Async GetCategoryItemQuery...', 'GetCategoryItemHandler');
    const { categoryId } = query;

    return this.categoryRepository.getCategoryItem(categoryId);
  }
}
