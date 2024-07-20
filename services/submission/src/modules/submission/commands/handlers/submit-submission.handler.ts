import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { SubmitSubmissionCommand } from '../impl';
import { SubmissionRepository } from '../../repositories';

@CommandHandler(SubmitSubmissionCommand)
export class SubmitSubmissionHandler
  implements ICommandHandler<SubmitSubmissionCommand>
{
  constructor(
    private readonly repository: SubmissionRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SubmitSubmissionCommand): Promise<any> {
    Logger.log('Async SubmitSubmissionHandler...', 'SubmitSubmissionCommand');
    const { submissionId, submitSubmissionDTO } = command;

    const submission = this.publisher.mergeObjectContext(
      await this.repository.submitSubmission(submissionId, submitSubmissionDTO),
    );

    submission.submitTakingExamination(submission.id);
    return { id: submission.id, success: true };
  }
}
