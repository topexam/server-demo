import { Inject, Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { ConfigService } from '@nestjs/config';

import { FileRepository } from '../../repositories';
import { GetFileDataQuery } from '../impl';

@QueryHandler(GetFileDataQuery)
export class GetFileDataHandler implements IQueryHandler<GetFileDataQuery> {
  constructor(
    private readonly fileRepository: FileRepository,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Inject(MINIO_CONNECTION) private readonly minioClient,
    private readonly configSrv: ConfigService,
  ) {}

  async execute(query: GetFileDataQuery): Promise<string> {
    Logger.log('Async GetFileDataQuery...', 'GetFileDataHandler');
    const { fileId } = query;
    const file = await this.fileRepository.getFileItem(fileId);
    const fileNameParts = file.name.split('.') || [];
    const fileName = fileNameParts.slice(0, fileNameParts.length - 1).join('.');
    const fileExt = fileNameParts.slice(fileNameParts.length - 1);
    const presignedUrl = await this.minioClient.presignedGetObject(
      this.configSrv.get<string>('DB.MINIO_BUCKET'),
      `${fileName}__${file._id}.${fileExt}`,
      60 * 60,
    );
    return presignedUrl;
  }
}
