import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ILeanDocumentWithMissingFields } from '@topexam/api.lib.common';
import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';

@Schema({
  timestamps: true,
  collection: 'question_option',
})
export class QuestionOptionModel {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  content: string;
}

export type IQuestionOptionDocument = QuestionOptionModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanQuestionOptionDocument = QuestionOptionModel &
  mongoose.LeanDocument<IQuestionOptionDocument> &
  ILeanDocumentWithMissingFields;

export const QuestionOptionSchema =
  SchemaFactory.createForClass(QuestionOptionModel);
