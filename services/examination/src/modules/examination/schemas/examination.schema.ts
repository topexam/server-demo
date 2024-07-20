import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import {
  ILeanDocumentWithMissingFields,
  transformDataForMongooseSchema,
} from '@topexam/api.lib.common';

import {
  ILeanSubCategoryDocument,
  ILeanTagDocument,
  ILeanUserDocument,
  SubCategoryModel,
  TagModel,
  UserModel,
} from '@/modules/data-listener';

import {
  EExaminationMode,
  EExaminationStatus,
  EExaminationType,
} from '../enums';

@Schema({
  timestamps: true,
  toObject: {
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
  collection: 'examination',
})
export class ExaminationModel {
  @Prop({
    required: true,
    index: 'text',
  })
  title: string;

  @Prop({
    required: true,
  })
  time: number;

  @Prop({
    default: null,
    index: 'text',
  })
  description: string | null;

  @Prop({
    default: null,
  })
  thumbnail: string | null;

  @Prop({
    default: 0,
  })
  rating: 0;

  @Prop({
    default: 0,
  })
  submitted_count: 0;

  @Prop({
    default: 0,
  })
  question_count: 0;

  @Prop({
    default: 0,
  })
  review_count: 0;

  @Prop({
    default: 0,
  })
  price: 0;

  @Prop({
    enum: Object.values(EExaminationStatus),
    default: EExaminationStatus.DRAFT,
  })
  status: EExaminationStatus;

  @Prop({
    enum: Object.values(EExaminationMode),
    default: EExaminationMode.NORMAL,
  })
  mode: EExaminationMode;

  @Prop({
    enum: Object.values(EExaminationType),
    default: EExaminationType.EXAMINATION,
  })
  type: EExaminationType;

  @Prop({
    default: null,
  })
  file: string | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: SubCategoryModel.name,
    autopopulate: { maxDepth: 1 },
    required: true,
  })
  sub_category_id: string;

  sub_category?: ILeanSubCategoryDocument;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: TagModel.name,
        autopopulate: { maxDepth: 1 },
      },
    ],
    required: true,
  })
  tag_ids: string[];

  tags: ILeanTagDocument[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserModel.name,
    autopopulate: { maxDepth: 1 },
    required: true,
  })
  author_id: string;

  author?: ILeanUserDocument;
}

export type IExaminationDocument = ExaminationModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanExaminationDocument = ExaminationModel &
  mongoose.LeanDocument<IExaminationDocument> &
  ILeanDocumentWithMissingFields;

const ExaminationSchema = SchemaFactory.createForClass(ExaminationModel);

ExaminationSchema.virtual('sub_category', {
  ref: SubCategoryModel.name,
  localField: 'sub_category_id',
  foreignField: '_id',
  justOne: true,
});

ExaminationSchema.virtual('tags', {
  ref: TagModel.name,
  localField: 'tag_ids',
  foreignField: '_id',
});

ExaminationSchema.virtual('author', {
  ref: UserModel.name,
  localField: 'author_id',
  foreignField: '_id',
  justOne: true,
});

ExaminationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export { ExaminationSchema };
