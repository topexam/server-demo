import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { SubCategoryRepository } from '../../repositories';
import { ILeanSubCategoryDocument } from '../../schemas';
import { GetSubCategoryListQuery } from '../impl';

@QueryHandler(GetSubCategoryListQuery)
export class GetSubCategoryListHandler
  implements IQueryHandler<GetSubCategoryListQuery>
{
  constructor(private readonly subCategoryRepository: SubCategoryRepository) {}

  async execute(
    query: GetSubCategoryListQuery,
  ): Promise<ILeanSubCategoryDocument[]> {
    Logger.log('Async GetSubCategoryListQuery...', 'GetSubCategoryListHandler');
    const categoryList = await this.subCategoryRepository.getSubCategoryList(
      query.aqp,
    );
    return categoryList;
  }
}
