import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  IDataExaminationPublishedEvent,
  ESubjectPattern,
  IEventMessageData,
} from '@topexam/api.lib.common';

import { DataListenerService } from './data-listener.service';

@Controller()
export class DataListenerListener {
  constructor(private readonly dataListenerSrv: DataListenerService) {}

  @EventPattern(ESubjectPattern.ExaminationPublished)
  async examinationPublishedHandler(
    data: IEventMessageData<IDataExaminationPublishedEvent['data']>,
  ): Promise<void> {
    Logger.log(
      `Received message / ${
        ESubjectPattern.ExaminationPublished
      } with payload: ${JSON.stringify(data)}`,
      'examinationPublishedHandler',
    );
    await this.dataListenerSrv.createExaminationFromEvent(data.value);

    Logger.log('SUCCESS');
  }
}
