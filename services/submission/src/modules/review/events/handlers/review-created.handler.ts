import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  IDataReviewCreatedEvent,
  ESubjectPattern,
} from '@topexam/api.lib.common';
import { ClientKafka } from '@nestjs/microservices';
import { EventStoreService } from '@topthithu/nest-eventstore';

import { ReviewRepository } from '../../repositories';
import { ReviewCreatedEvent } from '../impl';
import {
  REVIEW_ES_STREAM_NAME,
  REVIEW_KAFKA_CLIENT_NAME,
} from '../../constant';

@EventsHandler(ReviewCreatedEvent)
export class ReviewCreatedHandler implements IEventHandler<ReviewCreatedEvent> {
  constructor(
    private readonly repository: ReviewRepository,
    private readonly eventStoreSrv: EventStoreService,
    @Inject(REVIEW_KAFKA_CLIENT_NAME)
    private readonly publisher: ClientKafka,
  ) {}

  async handle(event: ReviewCreatedEvent): Promise<void> {
    Logger.log(event, 'ReviewCreatedEvent');

    const { reviewId } = event;
    const review = await this.repository.getReviewItem(reviewId);

    const data: IDataReviewCreatedEvent['data'] = {
      examinationId: review.examination_id,
      rating: review.rating,
    };

    await this.eventStoreSrv.appendEvent(REVIEW_ES_STREAM_NAME, {
      type: ESubjectPattern.ReviewCreated,
      data: data,
    });
    this.publisher
      .emit<string, IDataReviewCreatedEvent['data']>(
        ESubjectPattern.ReviewCreated,
        data,
      )
      .subscribe((guid) => {
        Logger.log(
          JSON.stringify({
            event: ESubjectPattern.ReviewCreated,
            data,
            guid,
          }),
          'ReviewCreatedHandler',
        );
      });
  }
}
