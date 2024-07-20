import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { SubCategoryRepository } from '../../repositories';
import { ILeanSubCategoryDocument } from '../../schemas';
import { GetSubCategoryItemQuery } from '../impl';

@QueryHandler(GetSubCategoryItemQuery)
export class GetSubCategoryItemHandler
  implements IQueryHandler<GetSubCategoryItemQuery>
{
  constructor(private readonly subCategoryRepository: SubCategoryRepository) {}

  async execute(
    query: GetSubCategoryItemQuery,
  ): Promise<ILeanSubCategoryDocument> {
    Logger.log('Async GetSubCategoryItemQuery...', 'GetSubCategoryItemHandler');
    const { subCategoryId } = query;
    return this.subCategoryRepository.getSubCategoryItem(subCategoryId);
  }
}
