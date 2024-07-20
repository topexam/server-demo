import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ExaminationRepository } from '../../repositories';
import { CountExaminationPropertyCommand } from '../impl';

@CommandHandler(CountExaminationPropertyCommand)
export class CountExaminationPropertyHandler
  implements ICommandHandler<CountExaminationPropertyCommand>
{
  constructor(
    private readonly repository: ExaminationRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CountExaminationPropertyCommand): Promise<any> {
    Logger.log(
      'Async CountExaminationPropertyHandler...',
      'CountExaminationPropertyCommand',
    );
    const { examinationId, countPropertyKey } = command;
    const examination = this.publisher.mergeObjectContext(
      await this.repository.countExaminationProperty(
        examinationId,
        countPropertyKey,
      ),
    );

    return { id: examination.id, success: true };
  }
}
