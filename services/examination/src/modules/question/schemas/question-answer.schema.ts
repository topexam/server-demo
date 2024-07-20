import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';

import { ILeanDocumentWithMissingFields } from '@topexam/api.lib.common';

@Schema({
  timestamps: true,
  collection: 'question_answer',
})
export class QuestionAnswerModel {
  @Prop({
    required: true,
  })
  options: string[];

  @Prop({
    default: null,
  })
  explain: string | null;
}

export type IQuestionAnswerDocument = QuestionAnswerModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanQuestionAnswerDocument = QuestionAnswerModel &
  mongoose.LeanDocument<IQuestionAnswerDocument> &
  ILeanDocumentWithMissingFields;

export const QuestionAnswerSchema =
  SchemaFactory.createForClass(QuestionAnswerModel);
