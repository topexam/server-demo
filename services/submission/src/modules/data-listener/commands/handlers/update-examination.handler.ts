import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { UpdateExaminationCommand } from '../impl';
import { ExaminationRepository } from '../../repositories';

@CommandHandler(UpdateExaminationCommand)
export class UpdateExaminationHandler
  implements ICommandHandler<UpdateExaminationCommand>
{
  constructor(private readonly repository: ExaminationRepository) {}

  async execute(command: UpdateExaminationCommand): Promise<void> {
    Logger.log('Async UpdateExaminationHandler...', 'UpdateExaminationCommand');
    const { updateExaminationDTO } = command;
    await this.repository.updateExamination(updateExaminationDTO);
  }
}
