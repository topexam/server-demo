import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IDataTagCreatedEvent, ESubjectPattern } from '@topexam/api.lib.common';
import { EventStoreService } from '@topthithu/nest-eventstore';

import { TagRepository } from '../../repositories';
import { TagCreatedEvent } from '../impl';
import { TAG_ES_STREAM_NAME, TAG_KAFKA_CLIENT_NAME } from '../../constant';

@EventsHandler(TagCreatedEvent)
export class TagCreatedHandler implements IEventHandler<TagCreatedEvent> {
  constructor(
    private readonly repository: TagRepository,
    private readonly eventStoreSrv: EventStoreService,
    @Inject(TAG_KAFKA_CLIENT_NAME)
    private readonly publisher: ClientKafka,
  ) {}

  async handle(event: TagCreatedEvent): Promise<void> {
    Logger.log(event, 'TagCreatedEvent');

    const { tagId } = event;
    const tag = await this.repository.getTagItem(tagId);

    const data: IDataTagCreatedEvent['data'] = {
      id: tag._id,
      name: tag.name,
      slug: tag.slug,
      version: 0,
    };

    try {
      await this.eventStoreSrv.appendEvent(TAG_ES_STREAM_NAME, {
        type: ESubjectPattern.TagCreated,
        data: data,
      });
    } catch (error) {
      Logger.error(error);
    }

    this.publisher
      .emit<string, IDataTagCreatedEvent['data']>(
        ESubjectPattern.TagCreated,
        data,
      )
      .subscribe((guid) => {
        Logger.log(
          JSON.stringify({
            event: ESubjectPattern.TagCreated,
            data,
            guid,
          }),
          TagCreatedHandler.name,
        );
      });
  }
}
