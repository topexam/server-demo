import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  RpcNotFoundException,
  ICommandResponse,
  IApiQueryParams,
} from '@topexam/api.lib.common';

import { CategoryService } from '@/modules/category';
import { CreateSubCategoryCommand } from './commands';
import { CreateSubCategoryDTO } from './dto';
import { GetSubCategoryListQuery, GetSubCategoryItemQuery } from './queries';
import { ILeanSubCategoryDocument } from './schemas';

@Injectable()
export class SubCategoryService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly categoryService: CategoryService,
  ) {}

  async getSubCategoryList(
    aqp: IApiQueryParams,
  ): Promise<ILeanSubCategoryDocument[]> {
    return this.queryBus.execute(new GetSubCategoryListQuery(aqp));
  }

  async getSubCategoryItem(
    subCategoryId: string,
  ): Promise<ILeanSubCategoryDocument> {
    const categoryItem = await this.queryBus.execute(
      new GetSubCategoryItemQuery(subCategoryId),
    );
    if (!categoryItem) throw new RpcNotFoundException();

    return categoryItem;
  }

  async createSubCategory(
    createSubCategoryDTO: CreateSubCategoryDTO,
  ): Promise<ICommandResponse> {
    const { category_id } = createSubCategoryDTO;
    await this.categoryService.getCategoryItem(category_id);

    const response = await this.commandBus.execute(
      new CreateSubCategoryCommand(createSubCategoryDTO),
    );
    return response;
  }
}
