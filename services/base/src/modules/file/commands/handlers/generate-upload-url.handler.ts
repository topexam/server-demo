import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FileRepository } from '../../repositories';
import { IGenerateUploadUrlResponse } from '../../types';
import { GenerateUploadUrlCommand } from '../impl';

@CommandHandler(GenerateUploadUrlCommand)
export class GenerateUploadUrlHandler
  implements ICommandHandler<GenerateUploadUrlCommand>
{
  constructor(
    private readonly repository: FileRepository,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Inject(MINIO_CONNECTION) private readonly minioClient,
    private readonly configSrv: ConfigService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(
    command: GenerateUploadUrlCommand,
  ): Promise<IGenerateUploadUrlResponse> {
    Logger.log('Async GenerateUploadUrlHandler...', 'GenerateUploadUrlCommand');
    const { uploaderId, generateUploadUrlDTO } = command;
    const isExisted = await this.minioClient.bucketExists(
      this.configSrv.get<string>('DB.MINIO_BUCKET'),
    );
    if (!isExisted) {
      await this.minioClient.makeBucket(
        this.configSrv.get<string>('DB.MINIO_BUCKET'),
      );
    }

    const file = this.publisher.mergeObjectContext(
      await this.repository.createFile(uploaderId, generateUploadUrlDTO),
    );

    const fileNameParts = generateUploadUrlDTO.name.split('.') || [];
    const fileName = fileNameParts.slice(0, fileNameParts.length - 1).join('.');
    const fileExt = fileNameParts.slice(fileNameParts.length - 1);

    const presignedUrl = await this.minioClient.presignedPutObject(
      this.configSrv.get<string>('DB.MINIO_BUCKET'),
      `${fileName}__${file.id}.${fileExt}`,
      60 * 60,
    );

    file.createFile();
    file.commit();

    return { id: file.id, success: true, upload_url: presignedUrl };
  }
}
