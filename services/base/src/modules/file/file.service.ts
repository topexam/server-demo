import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RpcNotFoundException } from '@topexam/api.lib.common';

import { GenerateUploadUrlCommand } from './commands';
import { GenerateUploadUrlDTO } from './dto';
import { GetFileDataQuery, GetFileItemQuery } from './queries';
import { ILeanFileDocument } from './schemas';
import { IGenerateUploadUrlResponse } from './types';

@Injectable()
export class FileService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async generateUploadUrl(
    uploaderId: string,
    uploadFileDTO: GenerateUploadUrlDTO,
  ): Promise<IGenerateUploadUrlResponse> {
    return this.commandBus.execute(
      new GenerateUploadUrlCommand(uploaderId, uploadFileDTO),
    );
  }

  async getFileData(fileId: string): Promise<string> {
    return this.queryBus.execute(new GetFileDataQuery(fileId));
  }

  async getFileItem(fileId: string): Promise<ILeanFileDocument> {
    const fileItem = await this.queryBus.execute(new GetFileItemQuery(fileId));
    if (!fileItem) throw new RpcNotFoundException();

    return fileItem;
  }
}
