import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ICommandResponse,
  RpcNotFoundException,
} from '@topexam/api.lib.common';

import { ECommandAction } from '@/enums';
import { CreateCategoryCommand, UpdateSubCategoryCommand } from './commands';
import { GetCategoryItemQuery, GetCategoryListQuery } from './queries';
import { ILeanCategoryDocument } from './schemas';
import { CreateCategoryDTO } from './dto';
import { IApiQueryParams } from '@topexam/api.lib.common';

@Injectable()
export class CategoryService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getCategoryList(
    aqp: IApiQueryParams,
  ): Promise<ILeanCategoryDocument[]> {
    return this.queryBus.execute(new GetCategoryListQuery(aqp));
  }

  async getCategoryItem(categoryId: string): Promise<ILeanCategoryDocument> {
    const category = await this.queryBus.execute(
      new GetCategoryItemQuery(categoryId),
    );
    if (!category) throw new RpcNotFoundException();

    return category;
  }

  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<ICommandResponse> {
    return this.commandBus.execute(
      new CreateCategoryCommand(createCategoryDTO),
    );
  }

  async updateSubCategory(
    id: string,
    data: { subCategoryId: string; action: ECommandAction },
  ): Promise<ICommandResponse> {
    return this.commandBus.execute(new UpdateSubCategoryCommand(id, data));
  }
}
