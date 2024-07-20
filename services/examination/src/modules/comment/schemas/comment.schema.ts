import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import {
  ILeanDocumentWithMissingFields,
  transformDataForMongooseSchema,
} from '@topexam/api.lib.common';

import { ILeanQuestionDocument, QuestionModel } from '@/modules/question';
import { ExaminationModel } from '@/modules/examination';

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
  collection: 'comment',
})
export class CommentModel {
  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: QuestionModel.name,
    autopopulate: { maxDepth: 1 },
    required: true,
  })
  question_id: string;

  question?: ILeanQuestionDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ExaminationModel.name,
    autopopulate: { maxDepth: 1 },
    required: true,
  })
  examination_id: string;
}

export type ICommentDocument = CommentModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanCommentDocument = mongoose.LeanDocument<ICommentDocument> &
  ILeanDocumentWithMissingFields;

const CommentSchema = SchemaFactory.createForClass(CommentModel);

CommentSchema.virtual('question', {
  ref: QuestionModel.name,
  localField: '_id',
  foreignField: 'question_id',
});

CommentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export { CommentSchema };
