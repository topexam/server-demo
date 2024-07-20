import { Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import {
  ILeanDocumentWithMissingFields,
  transformDataForMongooseSchema,
} from '@topexam/api.lib.common';

import { ILeanExaminationDocument } from '@/modules/examination';

import { EQuestionType } from '../enums';
import { ILeanQuestionAnswerDocument } from './question-answer.schema';
import { ILeanQuestionOptionDocument } from './question-option.schema';
import { QuestionModel } from './question.schema';
import { ILeanQuestionGroupDocument } from './question-group.schema';

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
})
export class FileQuestionModel implements QuestionModel {
  kind: string;
  type: EQuestionType;
  options: ILeanQuestionOptionDocument[];
  answers: ILeanQuestionAnswerDocument;
  question_group_id: string;
  question_group?: ILeanQuestionGroupDocument;
  examination_id: string;
  examination?: ILeanExaminationDocument;
  prev: string | null;
  next: string | null;
  order: number;
}

export type IFileQuestionDocument = FileQuestionModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanFileQuestionDocument = FileQuestionModel &
  mongoose.LeanDocument<IFileQuestionDocument> &
  ILeanDocumentWithMissingFields;

const FileQuestionSchema = SchemaFactory.createForClass(FileQuestionModel);

export { FileQuestionSchema };
