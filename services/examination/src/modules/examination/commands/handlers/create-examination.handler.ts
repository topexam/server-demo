import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CreateExaminationCommand } from '../impl';
import { ExaminationRepository } from '../../repositories';

@CommandHandler(CreateExaminationCommand)
export class CreateExaminationHandler
  implements ICommandHandler<CreateExaminationCommand>
{
  constructor(
    private readonly repository: ExaminationRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateExaminationCommand): Promise<any> {
    Logger.log('Async CreateExaminationHandler...', 'CreateExaminationCommand');
    const { createExaminationDTO } = command;
    const examination = this.publisher.mergeObjectContext(
      await this.repository.createExamination(createExaminationDTO),
    );

    examination.createExamination();
    examination.commit();

    return { id: examination.id, success: true };
  }
}
