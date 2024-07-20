import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { PublishExaminationCommand } from '../impl';
import { ExaminationRepository } from '../../repositories';

@CommandHandler(PublishExaminationCommand)
export class PublishExaminationHandler
  implements ICommandHandler<PublishExaminationCommand>
{
  constructor(
    private readonly repository: ExaminationRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: PublishExaminationCommand): Promise<any> {
    Logger.log(
      'Async PublishExaminationHandler...',
      'PublishExaminationCommand',
    );
    const { examinationId } = command;
    const examination = this.publisher.mergeObjectContext(
      await this.repository.publishExamination(examinationId),
    );

    examination.publishExamination();
    examination.commit();

    return { id: examination.id, success: true };
  }
}
