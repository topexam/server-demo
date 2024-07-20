import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  IDataSubCategoryCreatedEvent,
  ESubjectPattern,
} from '@topexam/api.lib.common';
import { ClientKafka } from '@nestjs/microservices';
import { EventStoreService } from '@topthithu/nest-eventstore';

import { SubCategoryRepository } from '../../repositories';
import { SubCategoryCreatedEvent } from '../impl';
import {
  SUB_CATEGORY_ES_STREAM_NAME,
  SUB_CATEGORY_KAFKA_CLIENT_NAME,
} from '../../constant';

@EventsHandler(SubCategoryCreatedEvent)
export class SubCategoryCreatedHandler
  implements IEventHandler<SubCategoryCreatedEvent>
{
  constructor(
    private readonly repository: SubCategoryRepository,
    private readonly eventStoreSrv: EventStoreService,
    @Inject(SUB_CATEGORY_KAFKA_CLIENT_NAME)
    private readonly publisher: ClientKafka,
  ) {}

  async handle(event: SubCategoryCreatedEvent): Promise<void> {
    Logger.log(event, 'SubCategoryCreatedEvent');

    const { subCategoryId } = event;
    const subCategory = await this.repository.getSubCategoryItem(subCategoryId);

    const data: IDataSubCategoryCreatedEvent['data'] = {
      id: subCategory._id,
      name: subCategory.name,
      slug: subCategory.slug,
      version: 0,
    };

    try {
      await this.eventStoreSrv.appendEvent(SUB_CATEGORY_ES_STREAM_NAME, {
        type: ESubjectPattern.SubCategoryCreated,
        data: data,
      });
    } catch (error) {
      Logger.error(error);
    }

    this.publisher
      .emit<string, IDataSubCategoryCreatedEvent['data']>(
        ESubjectPattern.SubCategoryCreated,
        data,
      )
      .subscribe((guid) => {
        Logger.log(
          JSON.stringify({
            event: ESubjectPattern.SubCategoryCreated,
            data,
            guid,
          }),
          SubCategoryCreatedHandler.name,
        );
      });
  }
}
