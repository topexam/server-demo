import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ILeanDocumentWithMissingFields } from '@topexam/api.lib.common';
import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';

@Schema({
  timestamps: true,
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
}

export type ISubCategoryDocument = SubCategoryModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanSubCategoryDocument =
  mongoose.LeanDocument<ISubCategoryDocument> & ILeanDocumentWithMissingFields;

const SubCategorySchema = SchemaFactory.createForClass(SubCategoryModel);

SubCategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export { SubCategorySchema };
