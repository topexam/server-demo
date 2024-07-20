import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  IDataExaminationTakenEvent,
  ESubjectPattern,
} from '@topexam/api.lib.common';
import { ClientKafka } from '@nestjs/microservices';
import { EventStoreService } from '@topthithu/nest-eventstore';

import { ExaminationRepository } from '@/modules/data-listener';

import { TakingExaminationStartedEvent } from '../impl';
import { SubmissionRepository } from '../../repositories';
import {
  SUBMISSION_ES_STREAM_NAME,
  SUBMISSION_KAFKA_CLIENT_NAME,
} from '../../constant';

@EventsHandler(TakingExaminationStartedEvent)
export class TakingExaminationStartedHandler
  implements IEventHandler<TakingExaminationStartedEvent>
{
  constructor(
    private readonly submissionRepository: SubmissionRepository,
    private readonly examinationRepository: ExaminationRepository,
    private readonly eventStoreSrv: EventStoreService,
    @Inject(SUBMISSION_KAFKA_CLIENT_NAME)
    private readonly publisher: ClientKafka,
  ) {}

  async handle(event: TakingExaminationStartedEvent): Promise<void> {
    Logger.log(event, 'TakingExaminationStartedEvent');
    const { submissionId, examinationId } = event;
    const submission = await this.submissionRepository.getSubmissionItem(
      submissionId,
    );
    const examination = await this.examinationRepository.getExaminationItem(
      examinationId,
    );
    const data: IDataExaminationTakenEvent['data'] = {
      id: submission.id,
      minute: examination.time,
    };

    await this.eventStoreSrv.appendEvent(SUBMISSION_ES_STREAM_NAME, {
      type: ESubjectPattern.ExaminationTaken,
      data: data,
    });

    this.publisher
      .emit<string, IDataExaminationTakenEvent['data']>(
        ESubjectPattern.ExaminationTaken,
        data,
      )
      .subscribe((guid) => {
        Logger.log(
          `Published message to ${ESubjectPattern.ExaminationTaken}`,
          'TakingExaminationStartedEvent',
        );
        Logger.log(
          `published message with guid: ${guid}`,
          'TakingExaminationStartedEvent',
        );
      });
  }
}
