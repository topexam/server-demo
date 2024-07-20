import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import {
  transformDataForMongooseSchema,
  ILeanDocumentWithMissingFields,
} from '@topexam/api.lib.common';

@Schema({
  timestamps: true,
  collection: 'tag',
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
})
export class TagModel {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  slug: string;

  @Prop({
    default: null,
  })
  note: string | null;
}

export type ITagDocument = TagModel & SoftDeleteDocument & mongoose.Document;
export type ILeanTagDocument = mongoose.LeanDocument<ITagDocument> &
  ILeanDocumentWithMissingFields;

const TagSchema = SchemaFactory.createForClass(TagModel);

TagSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export { TagSchema };
