import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import { ILeanDocumentWithMissingFields, transformDataForMongooseSchema } from '@topexam/api.lib.common';

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
  collection: 'question_answer',
})
export class QuestionAnswerModel {
  @Prop({
    required: true,
  })
  options: string[];

  @Prop({ default: null })
  explain: string | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionModel',
    required: true,
  })
  question_id: string;

  question?: any;
}

export type IQuestionAnswerDocument = QuestionAnswerModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanQuestionAnswerDocument =
  mongoose.LeanDocument<IQuestionAnswerDocument> &
    ILeanDocumentWithMissingFields;

const QuestionAnswerSchema = SchemaFactory.createForClass(QuestionAnswerModel);

QuestionAnswerSchema.virtual('question', {
  ref: 'QuestionModel',
  localField: '_id',
  foreignField: 'question_id',
});

export { QuestionAnswerSchema };
