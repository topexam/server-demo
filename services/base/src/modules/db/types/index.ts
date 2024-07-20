import { SchemaTimestampsConfig } from 'mongoose';

export type ILeanDocumentWithMissingFields = SchemaTimestampsConfig & {
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  _id: string;
};
