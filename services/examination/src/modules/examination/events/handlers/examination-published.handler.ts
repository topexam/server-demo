import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  IDataExaminationPublishedEvent,
  ESubjectPattern,
} from '@topexam/api.lib.common';
import { EventStoreService } from '@topthithu/nest-eventstore';

import {
  ILeanFileQuestionDocument,
  ILeanNormalQuestionDocument,
  QuestionRepository,
} from '@/modules/question';

import { ExaminationRepository } from '../../repositories';
import { ExaminationPublishedEvent } from '../impl';
import { convertListToLinkList } from '../../utils';
import {
  EXAMINATION_ES_STREAM_NAME,
  EXAMINATION_KAFKA_CLIENT_NAME,
} from '../../constant';
import { EExaminationMode } from '../../enums';

@EventsHandler(ExaminationPublishedEvent)
export class ExaminationPublishedHandler
  implements IEventHandler<ExaminationPublishedEvent>
{
  constructor(
    private readonly examinationRepository: ExaminationRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly eventStoreSrv: EventStoreService,
    @Inject(EXAMINATION_KAFKA_CLIENT_NAME)
    private readonly publisher: ClientKafka,
  ) {}

  async handle(event: ExaminationPublishedEvent): Promise<void> {
    Logger.log(event, 'ExaminationPublishedEvent');

    const { examinationId } = event;
    const examination = await this.examinationRepository.getExaminationItem(
      examinationId,
    );
    const questions =
      examination.mode === EExaminationMode.NORMAL
        ? await this.questionRepository.getQuestionList(examinationId, true)
        : await this.questionRepository.getFileQuestionList(
            examinationId,
            true,
          );

    const questionTransformed = convertListToLinkList<
      ILeanNormalQuestionDocument | ILeanFileQuestionDocument
    >(questions, []).reverse();
    const answerList = questionTransformed.map((item) => ({
      ...item.answers,
      question: item.id,
    }));

    const data: IDataExaminationPublishedEvent['data'] = {
      id: examination.id,
      title: examination.title,
      time: examination.time,
      question_count: examination.question_count,
      answers: answerList,
      version: 0,
    };

    try {
      await this.eventStoreSrv.appendEvent(EXAMINATION_ES_STREAM_NAME, {
        type: ESubjectPattern.ExaminationPublished,
        data: data,
      });
    } catch (error) {
      Logger.error(error);
    }

    this.publisher
      .emit<string, IDataExaminationPublishedEvent['data']>(
        ESubjectPattern.ExaminationPublished,
        data,
      )
      .subscribe((guid) => {
        Logger.log(
          JSON.stringify({
            event: ESubjectPattern.ExaminationPublished,
            data,
            guid,
          }),
          'ExaminationPublishedHandler',
        );
      });
  }
}
