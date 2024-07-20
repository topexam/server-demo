import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

import { CreateSubCategoryDTO } from '../dto';
import {
  ILeanSubCategoryDocument,
  ISubCategoryDocument,
  SubCategoryModel,
} from '../schemas';

export class SubCategoryRepository {
  constructor(
    @InjectModel(SubCategoryModel.name)
    private readonly subCategoryModel: SoftDeleteModel<ISubCategoryDocument>,
  ) {}

  async createSubCategory(
    createSubCategoryDTO: CreateSubCategoryDTO,
  ): Promise<string> {
    const subCategoryCreated = await new this.subCategoryModel({
      name: createSubCategoryDTO.name,
      slug: createSubCategoryDTO.slug,
      _id: createSubCategoryDTO.id,
    }).save();
    return subCategoryCreated.id;
  }

  async getSubCategoryItem(
    subCategoryId: string,
  ): Promise<ILeanSubCategoryDocument> {
    return this.subCategoryModel.findById(subCategoryId).lean();
  }
}
