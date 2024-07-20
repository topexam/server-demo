import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { UpdateQuestionNumForExaminationCommand } from '../impl';
import { ExaminationRepository } from '../../repositories';

@CommandHandler(UpdateQuestionNumForExaminationCommand)
export class UpdateQuestionNumForExaminationHandler
  implements ICommandHandler<UpdateQuestionNumForExaminationCommand>
{
  constructor(
    private readonly repository: ExaminationRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateQuestionNumForExaminationCommand): Promise<any> {
    Logger.log(
      'Async UpdateQuestionNumForExaminationHandler...',
      'UpdateQuestionNumForExaminationCommand',
    );
    const { examinationId, action } = command;

    const examination = this.publisher.mergeObjectContext(
      await this.repository.updateQuestionNumForExamination(
        examinationId,
        action,
      ),
    );

    return { id: examination.id, success: true };
  }
}
