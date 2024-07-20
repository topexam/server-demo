import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { DeleteExaminationCommand } from '../impl';
import { ExaminationRepository } from '../../repositories';

@CommandHandler(DeleteExaminationCommand)
export class DeleteExaminationHandler
  implements ICommandHandler<DeleteExaminationCommand>
{
  constructor(
    private readonly repository: ExaminationRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteExaminationCommand): Promise<any> {
    Logger.log('Async DeleteExaminationHandler...', 'DeleteExaminationCommand');
    const { examinationId } = command;
    const examination = this.publisher.mergeObjectContext(
      await this.repository.deleteExamination(examinationId),
    );

    return { id: examination.id, success: true };
  }
}
