import { Injectable } from '@nestjs/common';
import { IDataExaminationTakenEvent } from '@topexam/api.lib.common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import {
  EXAMINATION_QUEUE_NAME,
  EXAMINATION_TAKEN_PROCESS_NAME,
} from './constant';

@Injectable()
export class ExpirationService {
  constructor(
    @InjectQueue(EXAMINATION_QUEUE_NAME) private doingExaminationQueue: Queue,
  ) {}

  async handleExaminationTaken(
    data: IDataExaminationTakenEvent['data'],
  ): Promise<void> {
    const { id, minute } = data;
    await this.doingExaminationQueue.add(
      EXAMINATION_TAKEN_PROCESS_NAME,
      { userExaminationId: id },
      { delay: minute * 1000 * 60 },
    );
  }
}
