import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  IDataChallengeCreatedEvent,
  ESubjectPattern,
} from '@topexam/api.lib.common';
import { ClientKafka } from '@nestjs/microservices';
import { EventStoreService } from '@topthithu/nest-eventstore';

import { ChallengeRepository } from '../../repositories';
import { ChallengeCreatedEvent } from '../impl';
import {
  CHALLENGE_ES_STREAM_NAME,
  CHALLENGE_KAFKA_CLIENT_NAME,
} from '../../constant';

@EventsHandler(ChallengeCreatedEvent)
export class ChallengeCreatedHandler
  implements IEventHandler<ChallengeCreatedEvent>
{
  constructor(
    private readonly repository: ChallengeRepository,
    private readonly eventStoreSrv: EventStoreService,
    @Inject(CHALLENGE_KAFKA_CLIENT_NAME)
    private readonly publisher: ClientKafka,
  ) {}

  async handle(event: ChallengeCreatedEvent): Promise<void> {
    Logger.log(event, 'ChallengeCreatedEvent');

    const { challengeId } = event;
    const challenge = await this.repository.getChallengeItem(challengeId);

    const data: IDataChallengeCreatedEvent['data'] = {
      id: challenge.id,
      open_time: challenge.open_time,
      close_time: challenge.close_time,
      examination_id: challenge.examination_id,
      version: 0,
    };

    try {
      await this.eventStoreSrv.appendEvent(CHALLENGE_ES_STREAM_NAME, {
        type: ESubjectPattern.ChallengeCreated,
        data: data,
      });
    } catch (error) {
      Logger.error(error);
    }

    this.publisher
      .emit<string, IDataChallengeCreatedEvent['data']>(
        ESubjectPattern.ChallengeCreated,
        data,
      )
      .subscribe((guid) => {
        Logger.log(
          JSON.stringify({
            event: ESubjectPattern.ChallengeCreated,
            data,
            guid,
          }),
          ChallengeCreatedHandler.name,
        );
      });
  }
}
