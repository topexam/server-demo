import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import {
  transformDataForMongooseSchema,
  ILeanDocumentWithMissingFields,
} from '@topexam/api.lib.common';

import {
  ExaminationModel,
  ILeanExaminationDocument,
} from '@/modules/examination';

@Schema({
  timestamps: true,
  toObject: {
    transform(_, ret) {
      const transformed = transformDataForMongooseSchema(ret, [
        {
          keys: [
            'createdAt',
            'updatedAt',
            'deletedAt',
            'open_time',
            'close_time',
          ],
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
          keys: [
            'createdAt',
            'updatedAt',
            'deletedAt',
            'open_time',
            'close_time',
          ],
          type: 'date',
        },
      ]);
      return transformed;
    },
  },
  collection: 'challenge',
})
export class ChallengeModel {
  @Prop({
    type: Date,
    required: true,
  })
  open_time: string;

  @Prop({ type: Date, default: null })
  close_time: string | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ExaminationModel.name,
    autopopulate: { maxDepth: 1 },
    required: true,
  })
  examination_id: string;

  examination?: ILeanExaminationDocument;
}

export type IChallengeDocument = ChallengeModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanChallengeDocument = ChallengeModel &
  mongoose.LeanDocument<IChallengeDocument> &
  ILeanDocumentWithMissingFields;

const ChallengeSchema = SchemaFactory.createForClass(ChallengeModel);

ChallengeSchema.virtual('examination', {
  ref: ExaminationModel.name,
  localField: '_id',
  foreignField: 'examination_id',
  justOne: true,
});

ChallengeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export { ChallengeSchema };
