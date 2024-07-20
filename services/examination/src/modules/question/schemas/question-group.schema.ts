import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import {
  ILeanDocumentWithMissingFields,
  transformDataForMongooseSchema,
} from '@topexam/api.lib.common';

import { ILeanExaminationDocument } from '@/modules/examination';

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
  collection: 'question_group',
})
export class QuestionGroupModel {
  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    default: true,
  })
  is_default: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExaminationModel',
    autopopulate: { maxDepth: 1 },
    required: true,
  })
  examination_id: string;

  examination?: ILeanExaminationDocument;
}

export type IQuestionGroupDocument = QuestionGroupModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanQuestionGroupDocument = QuestionGroupModel &
  mongoose.LeanDocument<IQuestionGroupDocument> &
  ILeanDocumentWithMissingFields;

const QuestionGroupSchema = SchemaFactory.createForClass(QuestionGroupModel);

QuestionGroupSchema.virtual('examination', {
  ref: 'ExaminationModel',
  localField: 'examination_id',
  foreignField: '_id',
  justOne: true,
});

export { QuestionGroupSchema };
