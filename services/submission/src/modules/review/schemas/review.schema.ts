import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import {
  ILeanDocumentWithMissingFields,
  transformDataForMongooseSchema,
} from '@topexam/api.lib.common';

import {
  ExaminationModel,
  ILeanExaminationDocument,
} from '@/modules/data-listener';

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
  collection: 'review',
})
export class ReviewModel {
  @Prop({
    default: null,
  })
  content: string | null;

  @Prop({
    min: 1,
    max: 5,
    required: true,
  })
  rating: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ExaminationModel.name,
    autopopulate: { maxDepth: 1 },
    required: true,
  })
  examination_id: string;

  examination?: any;
}

export type IReviewDocument = ReviewModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanReviewDocument = mongoose.LeanDocument<IReviewDocument> &
  ILeanDocumentWithMissingFields;

const ReviewSchema = SchemaFactory.createForClass(ReviewModel);

ReviewSchema.virtual('examination', {
  ref: ExaminationModel.name,
  localField: '_id',
  foreignField: 'examination_id',
});

ReviewSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export { ReviewSchema };
