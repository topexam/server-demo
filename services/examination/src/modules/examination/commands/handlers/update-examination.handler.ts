import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { UpdateExaminationCommand } from '../impl';
import { ExaminationRepository } from '../../repositories';

@CommandHandler(UpdateExaminationCommand)
export class UpdateExaminationHandler
  implements ICommandHandler<UpdateExaminationCommand>
{
  constructor(
    private readonly repository: ExaminationRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateExaminationCommand): Promise<any> {
    Logger.log('Async UpdateExaminationHandler...', 'UpdateExaminationCommand');
    const { examinationId, updateExaminationDTO } = command;
    Logger.log(updateExaminationDTO, 'UpdateExaminationHandler');
    const examination = this.publisher.mergeObjectContext(
      await this.repository.updateExamination(
        examinationId,
        updateExaminationDTO,
      ),
    );

    return { id: examination.id, success: true };
  }
}
