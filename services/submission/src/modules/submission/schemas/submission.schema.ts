import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import {
  ILeanDocumentWithMissingFields,
  transformDataForMongooseSchema,
} from '@topexam/api.lib.common';

import { ExaminationModel, ILeanExaminationDocument } from '@/modules/data-listener';

import {
  QuestionAnswerSchema,
  QuestionAnswerModel,
} from './question-answer.schema';
import {
  SubmissionAnswerModel,
  SubmissionAnswerSchema,
} from './submission-answer.schema';
import { ESubmissionStatus } from '../enums';

@Schema({
  timestamps: true,
  toObject: {
    transform(_, ret) {
      const transformed = transformDataForMongooseSchema(ret, [
        {
          keys: [
            'start_time',
            'end_time',
            'view_answer',
            'createdAt',
            'updatedAt',
            'deletedAt',
          ],
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
          keys: [
            'start_time',
            'end_time',
            'view_answer',
            'createdAt',
            'updatedAt',
            'deletedAt',
          ],
          type: 'date',
        },
      ]);
      return transformed;
    },
  },
  collection: 'submission',
})
export class SubmissionModel {
  @Prop({
    type: Date,
    required: true,
  })
  start_time: string;

  @Prop({
    type: Date,
    default: null,
  })
  end_time: string | null;

  @Prop({
    default: 0,
  })
  result: number;

  @Prop({
    type: [SubmissionAnswerSchema],
    default: [],
  })
  user_answers: SubmissionAnswerModel[];

  @Prop({
    type: String,
    enum: Object.values(ESubmissionStatus),
    default: ESubmissionStatus.TAKING,
  })
  status: ESubmissionStatus;

  @Prop({
    default: 0,
  })
  question_count: number;

  @Prop({
    type: [QuestionAnswerSchema],
    default: [],
  })
  answers: QuestionAnswerModel[];

  @Prop({ type: Date, default: null })
  view_answer: string | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ExaminationModel.name,
    required: true,
  })
  examination_id: string;

  examination?: ILeanExaminationDocument;
}

export type ISubmissionDocument = SubmissionModel &
  SoftDeleteDocument &
  mongoose.Document;
export type ILeanSubmissionDocument =
  mongoose.LeanDocument<ISubmissionDocument> & ILeanDocumentWithMissingFields;

const SubmissionSchema = SchemaFactory.createForClass(SubmissionModel);

SubmissionSchema.virtual('examination', {
  ref: ExaminationModel.name,
  localField: '_id',
  foreignField: 'examination_id',
});

SubmissionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export { SubmissionSchema };
