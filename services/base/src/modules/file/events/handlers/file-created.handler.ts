import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  IDataFileCreatedEvent,
  ESubjectPattern,
} from '@topexam/api.lib.common';
import { ClientKafka } from '@nestjs/microservices';
import { EventStoreService } from '@topthithu/nest-eventstore';

import { FileRepository } from '../../repositories';
import { FileCreatedEvent } from '../impl';
import { FILE_ES_STREAM_NAME, FILE_KAFKA_CLIENT_NAME } from '../../constant';

@EventsHandler(FileCreatedEvent)
export class FileCreatedHandler implements IEventHandler<FileCreatedEvent> {
  constructor(
    private readonly repository: FileRepository,
    private readonly eventStoreSrv: EventStoreService,
    @Inject(FILE_KAFKA_CLIENT_NAME)
    private readonly publisher: ClientKafka,
  ) {}

  async handle(event: FileCreatedEvent): Promise<void> {
    Logger.log(event, 'FileCreatedEvent');

    const { fileId } = event;
    const file = await this.repository.getFileItem(fileId);

    const data: IDataFileCreatedEvent['data'] = {
      id: file._id,
      name: file.name,
      version: 0,
    };

    try {
      await this.eventStoreSrv.appendEvent(FILE_ES_STREAM_NAME, {
        type: ESubjectPattern.FileCreated,
        data: data,
      });
    } catch (error) {
      Logger.error(error);
    }

    this.publisher
      .emit<string, IDataFileCreatedEvent['data']>(
        ESubjectPattern.FileCreated,
        data,
      )
      .subscribe((guid) => {
        Logger.log(
          JSON.stringify({
            event: ESubjectPattern.FileCreated,
            data,
            guid,
          }),
          FileCreatedHandler.name,
        );
      });
  }
}
