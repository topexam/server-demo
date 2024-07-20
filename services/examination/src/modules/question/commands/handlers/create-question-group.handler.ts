import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CreateQuestionGroupCommand } from '../impl';
import { QuestionGroupRepository } from '../../repositories';

@CommandHandler(CreateQuestionGroupCommand)
export class CreateQuestionGroupHandler
  implements ICommandHandler<CreateQuestionGroupCommand>
{
  constructor(
    private readonly repository: QuestionGroupRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateQuestionGroupCommand): Promise<any> {
    Logger.log(
      'Async CreateQuestionGroupHandler...',
      'CreateQuestionGroupCommand',
    );
    const { examinationId, createQuestionGroupDTO } = command;
    const questionGroup = this.publisher.mergeObjectContext(
      await this.repository.createQuestionGroup(
        examinationId,
        createQuestionGroupDTO,
      ),
    );

    return { id: questionGroup.id, success: true };
  }
}
