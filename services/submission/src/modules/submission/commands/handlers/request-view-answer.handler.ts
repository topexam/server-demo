import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { SubmissionRepository } from '../../repositories';
import { RequestViewAnswerCommand } from '../impl';

@CommandHandler(RequestViewAnswerCommand)
export class RequestViewAnswerHandler
  implements ICommandHandler<RequestViewAnswerCommand>
{
  constructor(private readonly repository: SubmissionRepository) {}

  async execute(command: RequestViewAnswerCommand): Promise<any> {
    Logger.log('Async RequestViewAnswerHandler...', 'RequestViewAnswerCommand');
    const { examinationId, playerId } = command;

    const isSuccess = await this.repository.requestViewAnswer(
      examinationId,
      playerId,
    );
    return { success: isSuccess };
  }
}
