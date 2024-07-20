import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { SortOrder, Types } from 'mongoose';
import { IApiQueryParams } from '@topexam/api.lib.common';

import { CreateCategoryDTO } from '../dto';
import { CategoryEntity } from '../entities';
import {
  CategoryModel,
  ICategoryDocument,
  ILeanCategoryDocument,
} from '../schemas';

export class CategoryRepository {
  constructor(
    @InjectModel(CategoryModel.name)
    private readonly categoryModel: SoftDeleteModel<ICategoryDocument>,
  ) {}

  async getCategoryList(
    aqp: IApiQueryParams,
  ): Promise<ILeanCategoryDocument[]> {
    return this.categoryModel
      .find({
        ...aqp.filter,
        _id: {
          $gte: aqp.pagination.page_token
            ? Types.ObjectId.createFromHexString(aqp.pagination.page_token)
            : null,
        },
      })
      .sort(aqp.sort as Record<string, SortOrder>)
      .limit(aqp.pagination.page_size)
      .populate(['sub_categories'])
      .lean();
  }

  async getCategoryItem(categoryId: string): Promise<ILeanCategoryDocument> {
    return this.categoryModel
      .findById(categoryId)
      .populate(['sub_categories'])
      .lean();
  }

  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<CategoryEntity> {
    const categoryCreated = new this.categoryModel(createCategoryDTO);

    await categoryCreated.save();
    return new CategoryEntity(categoryCreated.id);
  }

  async addSubCategoryToCategory(
    categoryId: string,
    subCategoryId: string,
  ): Promise<CategoryEntity> {
    const category = await this.categoryModel.findById(categoryId);
    category.set({
      sub_category_ids: [...category.sub_category_ids, subCategoryId],
    });

    await category.save();
    return new CategoryEntity(category.id);
  }

  async removeSubCategoryFromCategory(
    categoryId: string,
    subCategoryId: string,
  ): Promise<CategoryEntity> {
    const category = await this.categoryModel.findById(categoryId);
    category.set({
      sub_category_ids: category.sub_category_ids.filter(
        (it) => it !== subCategoryId,
      ),
    });

    await category.save();
    return new CategoryEntity(category.id);
  }
}
