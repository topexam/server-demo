import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  ESubjectPattern,
  IDataExaminationCreatedEvent,
} from '@topexam/api.lib.common';
import { ClientKafka } from '@nestjs/microservices';
import { EventStoreService } from '@topthithu/nest-eventstore';

import {
  ILeanFileQuestionDocument,
  ILeanNormalQuestionDocument,
  QuestionRepository,
} from '@/modules/question';

import { ExaminationRepository } from '../../repositories';
import { ExaminationCreatedEvent } from '../impl';
import { convertListToLinkList } from '../../utils';
import {
  EXAMINATION_ES_STREAM_NAME,
  EXAMINATION_KAFKA_CLIENT_NAME,
} from '../../constant';
import { EExaminationMode } from '../../enums';

@EventsHandler(ExaminationCreatedEvent)
export class ExaminationCreatedHandler
  implements IEventHandler<ExaminationCreatedEvent>
{
  constructor(
    private readonly examinationRepository: ExaminationRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly eventStoreSrv: EventStoreService,
    @Inject(EXAMINATION_KAFKA_CLIENT_NAME)
    private readonly publisher: ClientKafka,
  ) {}

  async handle(event: ExaminationCreatedEvent): Promise<void> {
    Logger.log(event, 'ExaminationCreatedEvent');

    const { examinationId } = event;
    const examination = await this.examinationRepository.getExaminationItem(
      examinationId,
    );
    const questions =
      examination.mode === EExaminationMode.NORMAL
        ? await this.questionRepository.getQuestionList(examinationId)
        : await this.questionRepository.getFileQuestionList(examinationId);
    const questionTransformed = convertListToLinkList<
      ILeanNormalQuestionDocument | ILeanFileQuestionDocument
    >(questions, []).reverse();
    const answerList = questionTransformed.map((item) => ({
      ...item.answers,
      question: item.id,
    }));

    const data: IDataExaminationCreatedEvent['data'] = {
      id: examination.id,
      title: examination.title,
      time: examination.time,
      type: examination.type,
      answers: answerList,
      version: 0,
    };

    try {
      await this.eventStoreSrv.appendEvent(EXAMINATION_ES_STREAM_NAME, {
        type: ESubjectPattern.ExaminationCreated,
        data: data,
      });
    } catch (error) {
      Logger.error(error);
    }

    this.publisher
      .emit<string, IDataExaminationCreatedEvent['data']>(
        ESubjectPattern.ExaminationCreated,
        data,
      )
      .subscribe((guid) => {
        Logger.log(
          JSON.stringify({
            event: ESubjectPattern.ExaminationCreated,
            data,
            guid,
          }),
          'ExaminationCreatedHandler',
        );
      });
  }
}
