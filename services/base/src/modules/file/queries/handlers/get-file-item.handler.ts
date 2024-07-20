import { Inject, Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { ConfigService } from '@nestjs/config';

import { FileRepository } from '../../repositories';
import { GetFileItemQuery } from '../impl';
import { ILeanFileDocument } from '../../schemas';

@QueryHandler(GetFileItemQuery)
export class GetFileItemHandler implements IQueryHandler<GetFileItemQuery> {
  constructor(
    private readonly fileRepository: FileRepository,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Inject(MINIO_CONNECTION) private readonly minioClient,
    private readonly configSrv: ConfigService,
  ) {}

  async execute(query: GetFileItemQuery): Promise<ILeanFileDocument> {
    Logger.log('Async GetFileItemQuery...', 'GetFileItemHandler');
    const { fileId } = query;
    return this.fileRepository.getFileItem(fileId);
  }
}
