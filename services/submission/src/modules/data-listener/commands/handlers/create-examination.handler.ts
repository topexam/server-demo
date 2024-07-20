import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CreateExaminationCommand } from '../impl';
import { ExaminationRepository } from '../../repositories';

@CommandHandler(CreateExaminationCommand)
export class CreateExaminationHandler
  implements ICommandHandler<CreateExaminationCommand>
{
  constructor(private readonly repository: ExaminationRepository) {}

  async execute(command: CreateExaminationCommand): Promise<void> {
    Logger.log('Async CreateExaminationHandler...', 'CreateExaminationCommand');
    const { createExaminationDTO } = command;
    await this.repository.createExamination(createExaminationDTO);
  }
}
