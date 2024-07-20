import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CreateUserCommand } from '../impl';
import { UserRepository } from '../../repositories';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly repository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<void> {
    Logger.log('Async CreateUserHandler...', 'CreateUserCommand');
    const { createUserDTO } = command;
    await this.repository.createUser(createUserDTO);
  }
}
