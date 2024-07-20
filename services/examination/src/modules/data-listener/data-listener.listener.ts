import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  IDataSubCategoryCreatedEvent,
  IDataTagCreatedEvent,
  IDataUserCreatedEvent,
  ESubjectPattern,
} from '@topexam/api.lib.common';

import { DataListenerService } from './data-listener.service';

@Controller()
export class DataListenerListener {
  constructor(private readonly dataListenerSrv: DataListenerService) {}

  @EventPattern(ESubjectPattern.UserCreated)
  async userCreatedHandler(data: IDataUserCreatedEvent['data']): Promise<void> {
    Logger.log(
      `Received message / ${
        ESubjectPattern.UserCreated
      } with payload: ${JSON.stringify(data)}`,
      'userCreatedHandler',
    );
    await this.dataListenerSrv.createUserFromEvent(data);

    Logger.log('SUCCESS');
  }

  @EventPattern(ESubjectPattern.TagCreated)
  async tagCreatedHandler(data: IDataTagCreatedEvent['data']): Promise<void> {
    Logger.log(
      `Received message / ${
        ESubjectPattern.TagCreated
      } with payload: ${JSON.stringify(data)}`,
      'tagCreatedHandler',
    );
    await this.dataListenerSrv.createTagFromEvent(data);

    Logger.log('SUCCESS');
  }

  @EventPattern(ESubjectPattern.SubCategoryCreated)
  async subCategoryCreatedHandler(
    data: IDataSubCategoryCreatedEvent['data'],
  ): Promise<void> {
    Logger.log(
      `Received message / ${
        ESubjectPattern.SubCategoryCreated
      } with payload: ${JSON.stringify(data)}`,
      'subCategoryCreatedHandler',
    );
    await this.dataListenerSrv.createSubCategoryFromEvent(data);

    Logger.log('SUCCESS');
  }
}
