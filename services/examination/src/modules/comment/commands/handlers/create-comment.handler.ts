import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CreateCommentCommand } from '../impl';
import { CommentRepository } from '../../repositories';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private readonly repository: CommentRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateCommentCommand): Promise<any> {
    Logger.log('Async CreateCommentHandler...', 'CreateCommentCommand');
    const { questionId, commenterId, createCommentDTO } = command;
    const comment = this.publisher.mergeObjectContext(
      await this.repository.createComment(
        questionId,
        commenterId,
        createCommentDTO,
      ),
    );

    comment.createComment();
    comment.commit();

    return { id: comment.id, success: true };
  }
}
