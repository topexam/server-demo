import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ExaminationRepository } from '../../repositories';
import { CreateQuestionListFromFileCommand } from '../impl';

@CommandHandler(CreateQuestionListFromFileCommand)
export class CreateQuestionListFromFileHandler
  implements ICommandHandler<CreateQuestionListFromFileCommand>
{
  constructor(
    private readonly repository: ExaminationRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateQuestionListFromFileCommand): Promise<any> {
    Logger.log(
      'Async CreateQuestionListFromFileHandler...',
      'CreateQuestionListFromFileCommand',
    );
    const { examinationId, createQuestionListFromFileDTO } = command;

    const examination = this.publisher.mergeObjectContext(
      await this.repository.updateQuestionListFromPDF(
        examinationId,
        createQuestionListFromFileDTO,
      ),
    );

    examination.commit();

    return { id: examination.id, success: true };
  }
}
