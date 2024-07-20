import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CreateTagCommand } from '../impl';
import { TagRepository } from '../../repositories';

@CommandHandler(CreateTagCommand)
export class CreateTagHandler implements ICommandHandler<CreateTagCommand> {
  constructor(private readonly repository: TagRepository) {}

  async execute(command: CreateTagCommand): Promise<void> {
    Logger.log('Async CreateTagHandler...', 'CreateTagCommand');
    const { createTagDTO } = command;
    await this.repository.createTag(createTagDTO);
  }
}
