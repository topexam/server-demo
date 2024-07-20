import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  IDataCategoryCreatedEvent,
  ESubjectPattern,
} from '@topexam/api.lib.common';
import { ClientKafka } from '@nestjs/microservices';
import { EventStoreService } from '@topthithu/nest-eventstore';

import { CategoryRepository } from '../../repositories';
import { CategoryCreatedEvent } from '../impl';
import {
  CATEGORY_ES_STREAM_NAME,
  CATEGORY_KAFKA_CLIENT_NAME,
} from '../../constant';

@EventsHandler(CategoryCreatedEvent)
export class CategoryCreatedHandler
  implements IEventHandler<CategoryCreatedEvent>
{
  constructor(
    private readonly repository: CategoryRepository,
    private readonly eventStoreSrv: EventStoreService,
    @Inject(CATEGORY_KAFKA_CLIENT_NAME)
    private readonly publisher: ClientKafka,
  ) {}

  async handle(event: CategoryCreatedEvent): Promise<void> {
    Logger.log(JSON.stringify(event), 'CategoryCreatedEvent');

    const { categoryId } = event;
    const category = await this.repository.getCategoryItem(categoryId);

    const data: IDataCategoryCreatedEvent['data'] = {
      id: category._id,
      name: category.name,
      slug: category.slug,
      version: 0,
    };

    try {
      await this.eventStoreSrv.appendEvent(CATEGORY_ES_STREAM_NAME, {
        type: ESubjectPattern.CategoryCreated,
        data: data,
      });
    } catch (error) {
      Logger.error(error);
    }

    this.publisher
      .emit<string, IDataCategoryCreatedEvent['data']>(
        ESubjectPattern.CategoryCreated,
        data,
      )
      .subscribe((guid) => {
        Logger.log(
          JSON.stringify({
            event: ESubjectPattern.CategoryCreated,
            data,
            guid,
          }),
          CategoryCreatedHandler.name,
        );
      });
  }
}
