import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ICommandResponse } from '@topexam/api.lib.common';

import { ChallengeRepository } from '../../repositories';
import { CreateChallengeCommand } from '../impl';

@CommandHandler(CreateChallengeCommand)
export class CreateChallengeHandler
  implements ICommandHandler<CreateChallengeCommand>
{
  constructor(
    private readonly repository: ChallengeRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateChallengeCommand): Promise<ICommandResponse> {
    Logger.log('Async CreateChallengeHandler...', 'CreateChallengeCommand');
    const { userId, createChallengeDTO } = command;
    const challenge = this.publisher.mergeObjectContext(
      await this.repository.createChallenge(userId, createChallengeDTO),
    );

    challenge.createChallenge(userId, createChallengeDTO);
    challenge.commit();

    return { id: challenge.id, success: true };
  }
}
