import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ILeanDocumentWithMissingFields } from '@topexam/api.lib.common';
import mongoose from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';

@Schema({
  timestamps: true,
  collection: 'user',
})
export class UserModel {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop()
  avatar?: string;

  @Prop()
  first_name?: string;

  @Prop()
  last_name?: string;

  @Prop()
  middle_name?: string;
}

export type IUserDocument = UserModel & SoftDeleteDocument & mongoose.Document;
export type ILeanUserDocument = mongoose.LeanDocument<IUserDocument> &
  ILeanDocumentWithMissingFields;

const UserSchema = SchemaFactory.createForClass(UserModel);

UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export { UserSchema };
