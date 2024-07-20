import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GenerateUploadUrlDTO } from '../dto';
import { FileEntity } from '../entities';
import { FileModel, IFileDocument, ILeanFileDocument } from '../schemas';

export class FileRepository {
  constructor(
    @InjectModel(FileModel.name)
    private readonly fileModel: Model<IFileDocument>,
  ) {}

  async getFileItem(fileId: string): Promise<ILeanFileDocument> {
    return this.fileModel.findById(fileId).lean();
  }

  async createFile(
    uploaderId: string,
    generateUploadFileDTO: GenerateUploadUrlDTO,
  ): Promise<FileEntity> {
    const fileCreated = new this.fileModel({
      uploader: uploaderId,
      ...generateUploadFileDTO,
    });

    await fileCreated.save();
    return new FileEntity(fileCreated.id);
  }
}
