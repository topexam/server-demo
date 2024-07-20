import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ICommandResponse } from '@topexam/api.lib.common';

import { CreateSubmissionCommand } from '../impl';
import { SubmissionRepository } from '../../repositories';

@CommandHandler(CreateSubmissionCommand)
export class CreateSubmissionHandler
  implements ICommandHandler<CreateSubmissionCommand>
{
  constructor(
    private readonly repository: SubmissionRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateSubmissionCommand): Promise<ICommandResponse> {
    Logger.log('Async CreateSubmissionHandler...', 'CreateSubmissionCommand');
    const { examinationId, playerId } = command;
    const submission = this.publisher.mergeObjectContext(
      await this.repository.createSubmission(examinationId, playerId),
    );

    submission.startTakingExamination(submission.id, examinationId);
    submission.commit();

    return { id: submission.id, success: true };
  }
}
