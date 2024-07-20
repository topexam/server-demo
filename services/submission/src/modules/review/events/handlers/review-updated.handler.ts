import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  IDataReviewUpdatedEvent,
  ESubjectPattern,
} from '@topexam/api.lib.common';
import { EventStoreService } from '@topthithu/nest-eventstore';

import { ReviewRepository } from '../../repositories';
import { ReviewUpdatedEvent } from '../impl';
import {
  REVIEW_ES_STREAM_NAME,
  REVIEW_KAFKA_CLIENT_NAME,
} from '../../constant';

@EventsHandler(ReviewUpdatedEvent)
export class ReviewUpdatedHandler implements IEventHandler<ReviewUpdatedEvent> {
  constructor(
    private readonly repository: ReviewRepository,
    private readonly eventStoreSrv: EventStoreService,
    @Inject(REVIEW_KAFKA_CLIENT_NAME)
    private readonly publisher: ClientKafka,
  ) {}

  async handle(event: ReviewUpdatedEvent): Promise<void> {
    Logger.log(event, 'ReviewUpdatedEvent');

    const { reviewId, oldReview } = event;
    const review = await this.repository.getReviewItem(reviewId);

    const data: IDataReviewUpdatedEvent['data'] = {
      examinationId: review.examination_id,
      oldRating: oldReview,
      newRating: review.rating,
    };

    await this.eventStoreSrv.appendEvent(REVIEW_ES_STREAM_NAME, {
      type: ESubjectPattern.ReviewUpdated,
      data: data,
    });
    this.publisher
      .emit<string, IDataReviewUpdatedEvent['data']>(
        ESubjectPattern.ReviewUpdated,
        data,
      )
      .subscribe((guid) => {
        Logger.log(
          JSON.stringify({
            event: ESubjectPattern.ReviewCreated,
            data,
            guid,
          }),
          'ReviewUpdatedHandler',
        );
      });
  }
}
