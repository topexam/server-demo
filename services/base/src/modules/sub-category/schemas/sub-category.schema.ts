import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import {
  ILeanDocumentWithMissingFields,
  transformDataForMongooseSchema,
} from '@topexam/api.lib.common';

import { ILeanCategoryDocument } from '@/modules/category/schemas';

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
  collection: 'sub_category',
})
export class SubCategoryModel {
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
    type: mongoose.Schema.Types.ObjectId,
  })
  category_id: string;

  category?: ILeanCategoryDocument;
}

export type ISubCategoryDocument = SubCategoryModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanSubCategoryDocument =
  mongoose.LeanDocument<ISubCategoryDocument> & ILeanDocumentWithMissingFields;

const SubCategorySchema = SchemaFactory.createForClass(SubCategoryModel);

SubCategorySchema.virtual('category', {
  ref: 'CategoryModel',
  localField: 'category_id',
  foreignField: '_id',
  justOne: true,
  autopopulate: { maxDepth: 2 },
});

SubCategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export { SubCategorySchema };
