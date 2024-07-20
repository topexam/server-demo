import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ICommandResponse } from '@topexam/api.lib.common';

import { TagRepository } from '../../repositories';
import { CreateTagCommand } from '../impl';

@CommandHandler(CreateTagCommand)
export class CreateTagHandler implements ICommandHandler<CreateTagCommand> {
  constructor(
    private readonly repository: TagRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateTagCommand): Promise<ICommandResponse> {
    Logger.log('Async CreateTagHandler...', 'CreateTagCommand');
    const { createTagDTO } = command;
    const tag = this.publisher.mergeObjectContext(
      await this.repository.createTag(createTagDTO),
    );

    tag.createTag();
    tag.commit();

    return { id: tag.id, success: true };
  }
}
