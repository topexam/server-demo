import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ICommandResponse } from '@topexam/api.lib.common';

import { ChallengeRepository } from '../../repositories';
import { DeleteChallengeCommand } from '../impl';

@CommandHandler(DeleteChallengeCommand)
export class DeleteChallengeHandler
  implements ICommandHandler<DeleteChallengeCommand>
{
  constructor(
    private readonly repository: ChallengeRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteChallengeCommand): Promise<ICommandResponse> {
    Logger.log('Async DeleteChallengeHandler...', 'DeleteChallengeCommand');
    const { challengeId, userId } = command;
    this.publisher.mergeObjectContext(
      await this.repository.deleteChallenge(challengeId, userId),
    );

    return { id: challengeId, success: true };
  }
}
