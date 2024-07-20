import { Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  IDataExaminationTakenEvent,
  ESubjectPattern,
  IEventMessageData,
} from '@topexam/api.lib.common';

import { ExpirationService } from './expiration.service';

export class ExpirationListener {
  constructor(private readonly expirationService: ExpirationService) {}

  @EventPattern(ESubjectPattern.ExaminationTaken)
  async examinationTakenHandler(
    @Payload() data: IEventMessageData<IDataExaminationTakenEvent['data']>,
  ): Promise<void> {
    Logger.log(
      `Received message / ${
        ESubjectPattern.ExaminationTaken
      } with payload: ${JSON.stringify(data)}`,
      'examinationTakenHandler',
    );
    await this.expirationService.handleExaminationTaken(data.value);
  }
}
