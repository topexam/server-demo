import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import {
  ESubjectPattern,
  IDataExaminationExpirationEvent,
} from '@topexam/api.lib.common';
import { ClientKafka } from '@nestjs/microservices';

import {
  EXAMINATION_QUEUE_NAME,
  EXAMINATION_TAKEN_PROCESS_NAME,
  EXPIRATION_KAFKA_CLIENT_NAME,
} from './constant';

@Processor(EXAMINATION_QUEUE_NAME)
export class ExaminationProcessor {
  private readonly logger = new Logger(ExaminationProcessor.name);

  constructor(
    @Inject(EXPIRATION_KAFKA_CLIENT_NAME)
    private readonly publisher: ClientKafka,
  ) {}

  @Process(EXAMINATION_TAKEN_PROCESS_NAME)
  handleExpirationTaken(job: Job): void {
    this.logger.log(job.data);
    const data = {
      userExaminationId: job.data['userExaminationId'],
    };
    this.publisher
      .emit<string, IDataExaminationExpirationEvent['data']>(
        ESubjectPattern.ExaminationExpiration,
        data,
      )
      .subscribe((guid) => {
        Logger.log(
          JSON.stringify({
            event: ESubjectPattern.ExaminationExpiration,
            data,
            guid,
          }),
          'ExaminationProcessor',
        );
      });
  }
}
