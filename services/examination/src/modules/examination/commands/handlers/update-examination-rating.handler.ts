import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { UpdateExaminationRatingCommand } from '../impl';
import { ExaminationRepository } from '../../repositories';

@CommandHandler(UpdateExaminationRatingCommand)
export class UpdateExaminationRatingHandler
  implements ICommandHandler<UpdateExaminationRatingCommand>
{
  constructor(
    private readonly repository: ExaminationRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateExaminationRatingCommand): Promise<any> {
    Logger.log(
      'Async UpdateExaminationRatingHandler...',
      'UpdateExaminationRatingCommand',
    );
    const { examinationId, resultRating } = command;
    Logger.log({ resultRating }, 'UpdateExaminationRatingHandler');
    const examination = this.publisher.mergeObjectContext(
      await this.repository.updateExaminationRating(
        examinationId,
        resultRating,
      ),
    );

    return { id: examination.id, success: true };
  }
}
