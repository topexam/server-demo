import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import {
  QuestionAnswerSchema,
  QuestionAnswerModel,
} from './question-answer.schema';
import { ILeanDocumentWithMissingFields } from '@topexam/api.lib.common';

@Schema({
  timestamps: true,
  collection: 'examination',
})
export class ExaminationModel {
  @Prop({
    required: true,
  })
  time: number;
  @Prop({
    default: 0,
  })
  question_count: number;
  @Prop({
    type: [QuestionAnswerSchema],
  })
  answers: QuestionAnswerModel[];
}

export type IExaminationDocument = ExaminationModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanExaminationDocument =
  mongoose.LeanDocument<IExaminationDocument> & ILeanDocumentWithMissingFields;

const ExaminationSchema = SchemaFactory.createForClass(ExaminationModel);

ExaminationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export { ExaminationSchema };
