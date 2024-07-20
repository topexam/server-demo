import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import {
  ILeanDocumentWithMissingFields,
  transformDataForMongooseSchema,
} from '@topexam/api.lib.common';

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
  collection: 'file',
})
export class FileModel {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  size: number;

  @Prop({
    required: true,
  })
  type: string;

  @Prop({
    required: true,
  })
  resource: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  uploader: string;
}

export type IFileDocument = FileModel & SoftDeleteDocument & mongoose.Document;
export type ILeanFileDocument = mongoose.LeanDocument<IFileDocument> &
  ILeanDocumentWithMissingFields;

const FileSchema = SchemaFactory.createForClass(FileModel);

FileSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export { FileSchema };
