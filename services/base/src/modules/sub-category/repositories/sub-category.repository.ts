import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { SortOrder, Types } from 'mongoose';
import { IApiQueryParams } from '@topexam/api.lib.common';

import { CreateSubCategoryDTO } from '../dto';
import { SubCategoryEntity } from '../entities';
import {
  SubCategoryModel,
  ISubCategoryDocument,
  ILeanSubCategoryDocument,
} from '../schemas';

export class SubCategoryRepository {
  constructor(
    @InjectModel(SubCategoryModel.name)
    private readonly subCategoryModel: SoftDeleteModel<ISubCategoryDocument>,
  ) {}

  async getSubCategoryList(
    aqp: IApiQueryParams,
  ): Promise<ILeanSubCategoryDocument[]> {
    return this.subCategoryModel
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
      .populate('category')
      .lean();
  }

  async getSubCategoryItem(
    subCategoryId: string,
  ): Promise<ILeanSubCategoryDocument> {
    return this.subCategoryModel
      .findById(subCategoryId)
      .populate('category')
      .lean();
  }

  async createSubCategory(
    createSubCategoryDTO: CreateSubCategoryDTO,
  ): Promise<SubCategoryEntity> {
    const subCategoryCreated = new this.subCategoryModel({
      ...createSubCategoryDTO,
      category_id: createSubCategoryDTO.category_id,
    });
    await subCategoryCreated.save();
    return new SubCategoryEntity(subCategoryCreated.id);
  }
}
