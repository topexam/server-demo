import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import {
  IDataCommentCreatedEvent,
  ESubjectPattern,
} from '@topexam/api.lib.common';
import { EventStoreService } from '@topthithu/nest-eventstore';

import { CommentRepository } from '../../repositories';
import { CommentCreatedEvent } from '../impl';
import { COMMENT_ES_STREAM_NAME } from '../../constant';

@EventsHandler(CommentCreatedEvent)
export class CommentCreatedHandler
  implements IEventHandler<CommentCreatedEvent>
{
  constructor(
    private readonly repository: CommentRepository,
    private readonly eventStoreSrv: EventStoreService,
  ) {}

  async handle(event: CommentCreatedEvent): Promise<void> {
    Logger.log(event, 'CommentCreatedEvent');

    const { commentId } = event;
    const comment = await this.repository.getCommentItem(commentId);

    const data: IDataCommentCreatedEvent['data'] = {
      id: comment.id,
      content: comment.content,
      commenter_id: comment.create_by_id,
      question_id: comment.question_id,
      examination_id: comment.examination_id,
      version: 0,
    };
    await this.eventStoreSrv.appendEvent(COMMENT_ES_STREAM_NAME, {
      type: ESubjectPattern.CommentCreated,
      data: data,
    });
  }
}
