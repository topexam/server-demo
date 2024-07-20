import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';

@Schema({
  timestamps: true,
  collection: 'question_answer',
})
export class QuestionAnswerModel {
  @Prop({
    required: true,
  })
  options: string[];
  @Prop()
  explain: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  })
  question: string;
}

export type IQuestionAnswerDocument = QuestionAnswerModel &
  SoftDeleteDocument &
  mongoose.Document;

export const QuestionAnswerSchema =
  SchemaFactory.createForClass(QuestionAnswerModel);
