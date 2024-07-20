import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  IDataExaminationSubmittedEvent,
  ESubjectPattern,
} from '@topexam/api.lib.common';
import { EventStoreService } from '@topthithu/nest-eventstore';

import { TakingExaminationSubmittedEvent } from '../impl';
import { SubmissionRepository } from '../../repositories';
import {
  SUBMISSION_ES_STREAM_NAME,
  SUBMISSION_KAFKA_CLIENT_NAME,
} from '../../constant';

@EventsHandler(TakingExaminationSubmittedEvent)
export class TakingExaminationSubmittedHandler
  implements IEventHandler<TakingExaminationSubmittedEvent>
{
  constructor(
    private readonly submissionRepository: SubmissionRepository,
    private readonly eventStoreSrv: EventStoreService,
    @Inject(SUBMISSION_KAFKA_CLIENT_NAME)
    private readonly publisher: ClientKafka,
  ) {}

  async handle(event: TakingExaminationSubmittedEvent): Promise<void> {
    Logger.log(event, 'TakingExaminationSubmittedEvent');
    const { submissionId } = event;
    const submission = await this.submissionRepository.getSubmissionItem(
      submissionId,
    );
    const data: IDataExaminationSubmittedEvent['data'] = {
      examinationId: submission.examination_id,
    };

    await this.eventStoreSrv.appendEvent(SUBMISSION_ES_STREAM_NAME, {
      type: ESubjectPattern.ExaminationSubmitted,
      data: data,
    });

    this.publisher
      .emit<string, IDataExaminationSubmittedEvent['data']>(
        ESubjectPattern.ExaminationSubmitted,
        data,
      )
      .subscribe((guid) => {
        Logger.log(
          `Published message to ${ESubjectPattern.ExaminationSubmitted}`,
          'TakingExaminationSubmittedEvent',
        );
        Logger.log(
          `published message with guid: ${guid}`,
          'TakingExaminationSubmittedEvent',
        );
      });
  }
}
