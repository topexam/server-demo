import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import { transformDataForMongooseSchema } from '@topexam/api.lib.common';

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
  collection: 'submission_answer',
})
export class SubmissionAnswerModel {
  @Prop({
    required: true,
  })
  options: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,
  })
  taker_id: string;

  taker?: any;
}

export type ISubmissionAnswerDocument = SubmissionAnswerModel &
  SoftDeleteDocument &
  mongoose.Document;

const SubmissionAnswerSchema = SchemaFactory.createForClass(
  SubmissionAnswerModel,
);

SubmissionAnswerSchema.virtual('taker', {
  ref: 'UserModel',
  localField: '_id',
  foreignField: 'taker_id',
});

export { SubmissionAnswerSchema };
