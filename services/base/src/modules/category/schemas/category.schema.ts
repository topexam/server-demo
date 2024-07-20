import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import {
  ILeanDocumentWithMissingFields,
  transformDataForMongooseSchema,
} from '@topexam/api.lib.common';

import {
  ILeanSubCategoryDocument,
  SubCategoryModel,
} from '@/modules/sub-category/schemas';

@Schema({
  timestamps: true,
  toObject: {
    virtuals: true,
    transform(_, ret) {
      const transformed = transformDataForMongooseSchema(ret, [
        {
          keys: ['createdAt', 'updatedAt', 'deletedAt'],
          type: 'date',
        },
      ]);
      return transformed;
    },
  },
  toJSON: {
    virtuals: true,
    transform(_, ret) {
      const transformed = transformDataForMongooseSchema(ret, [
        {
          keys: ['createdAt', 'updatedAt', 'deletedAt'],
          type: 'date',
        },
      ]);
      return transformed;
    },
  },
  collection: 'category',
})
export class CategoryModel {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  slug: string;

  @Prop({
    default: null,
  })
  note: string | null;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    default: [],
  })
  sub_category_ids: string[];

  sub_categories: ILeanSubCategoryDocument[];
}

export type ICategoryDocument = CategoryModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanCategoryDocument = mongoose.LeanDocument<ICategoryDocument> &
  ILeanDocumentWithMissingFields;

const CategorySchema = SchemaFactory.createForClass(CategoryModel);

CategorySchema.virtual('sub_categories', {
  ref: SubCategoryModel.name,
  localField: 'sub_category_ids',
  foreignField: '_id',
  justOne: false,
  autopopulate: { maxDepth: 2 },
});

CategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export { CategorySchema };
