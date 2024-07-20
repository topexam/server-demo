import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  IDataQuestionCreatedEvent,
  ESubjectPattern,
} from '@topexam/api.lib.common';
import { ClientKafka } from '@nestjs/microservices';
import { EventStoreService } from '@topthithu/nest-eventstore';

import { QuestionRepository } from '../../repositories';
import { QuestionCreatedEvent } from '../impl';
import {
  QUESTION_ES_STREAM_NAME,
  QUESTION_KAFKA_CLIENT_NAME,
} from '../../constant';

@EventsHandler(QuestionCreatedEvent)
export class QuestionCreatedHandler
  implements IEventHandler<QuestionCreatedEvent>
{
  constructor(
    private readonly repository: QuestionRepository,
    private readonly eventStoreSrv: EventStoreService,
    @Inject(QUESTION_KAFKA_CLIENT_NAME)
    private readonly publisher: ClientKafka,
  ) {}

  async handle(event: QuestionCreatedEvent): Promise<void> {
    Logger.log(event, 'QuestionCreatedEvent');

    const { questionId } = event;
    const question = await this.repository.getQuestionItem(questionId);

    const data: IDataQuestionCreatedEvent['data'] = {
      id: question.id,
      examination: question.examination_id,
      prev: question.prev,
      next: question.next,
    };

    try {
      await this.eventStoreSrv.appendEvent(QUESTION_ES_STREAM_NAME, {
        type: ESubjectPattern.QuestionCreated,
        data: data,
      });
    } catch (error) {
      Logger.error(error);
    }

    this.publisher
      .emit<string, IDataQuestionCreatedEvent['data']>(
        ESubjectPattern.QuestionCreated,
        data,
      )
      .subscribe((guid) => {
        Logger.log(
          JSON.stringify({
            event: ESubjectPattern.QuestionCreated,
            data,
            guid,
          }),
          QuestionCreatedHandler.name,
        );
      });
  }
}
