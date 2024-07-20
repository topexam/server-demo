import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ICommandResponse } from '@topexam/api.lib.common';

import { ChallengeRepository } from '../../repositories';
import { UpdateChallengeCommand } from '../impl';

@CommandHandler(UpdateChallengeCommand)
export class UpdateChallengeHandler
  implements ICommandHandler<UpdateChallengeCommand>
{
  constructor(
    private readonly repository: ChallengeRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateChallengeCommand): Promise<ICommandResponse> {
    Logger.log('Async UpdateChallengeHandler...', 'UpdateChallengeCommand');
    const { challengeId, userId, updateChallengeDTO } = command;
    this.publisher.mergeObjectContext(
      await this.repository.updateChallenge(
        challengeId,
        userId,
        updateChallengeDTO,
      ),
    );

    return { id: challengeId, success: true };
  }
}
