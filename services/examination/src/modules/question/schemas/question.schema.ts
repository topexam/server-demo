import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import {
  ILeanDocumentWithMissingFields,
  transformDataForMongooseSchema,
} from '@topexam/api.lib.common';

import { ILeanExaminationDocument } from '@/modules/examination';
import { EQuestionType } from '../enums';
import {
  ILeanQuestionGroupDocument,
  QuestionGroupModel,
} from './question-group.schema';
import {
  ILeanQuestionOptionDocument,
  QuestionOptionSchema,
} from './question-option.schema';
import {
  ILeanQuestionAnswerDocument,
  QuestionAnswerSchema,
} from './question-answer.schema';
import { NormalQuestionModel } from './normal-question.schema';
import { FileQuestionModel } from './file-question.schema';

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
  collection: 'question',
  discriminatorKey: 'kind',
})
export class QuestionModel {
  @Prop({
    type: String,
    required: true,
    enum: [NormalQuestionModel.name, FileQuestionModel.name],
  })
  kind: string;

  @Prop({
    enum: Object.values(EQuestionType),
    default: EQuestionType.CHECK_LIST,
  })
  type: EQuestionType;

  @Prop({
    type: [QuestionOptionSchema],
    default: [],
  })
  options: ILeanQuestionOptionDocument[];

  @Prop({
    type: QuestionAnswerSchema,
    default: { options: [], explain: null },
  })
  answers: ILeanQuestionAnswerDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: QuestionGroupModel.name,
    autopopulate: { maxDepth: 1 },
    required: true,
  })
  question_group_id: string;

  question_group?: ILeanQuestionGroupDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExaminationModel',
    autopopulate: { maxDepth: 1 },
    required: true,
  })
  examination_id: string;

  examination?: ILeanExaminationDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: QuestionModel.name,
    default: null,
  })
  prev: string | null;

  question_prev?: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: QuestionModel.name,
    default: null,
  })
  next: string | null;

  question_next?: any;

  @Prop({
    type: Number,
    default: 0,
  })
  order: number | null;
}

export type IQuestionDocument = QuestionModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanQuestionDocument = QuestionModel &
  mongoose.LeanDocument<IQuestionDocument> &
  ILeanDocumentWithMissingFields;

const QuestionSchema = SchemaFactory.createForClass(QuestionModel);

QuestionSchema.virtual('question_group', {
  ref: QuestionGroupModel.name,
  localField: 'question_group_id',
  foreignField: '_id',
  justOne: true,
});

QuestionSchema.virtual('examination', {
  ref: 'ExaminationModel',
  localField: 'examination_id',
  foreignField: '_id',
  justOne: true,
});

QuestionSchema.virtual('question_prev', {
  ref: QuestionModel.name,
  localField: 'prev',
  foreignField: '_id',
  justOne: true,
});

QuestionSchema.virtual('question_next', {
  ref: QuestionModel.name,
  localField: 'next',
  foreignField: '_id',
  justOne: true,
});

QuestionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export { QuestionSchema };
