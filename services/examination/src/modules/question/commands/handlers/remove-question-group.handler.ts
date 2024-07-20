import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { RemoveQuestionGroupCommand } from '../impl';
import { QuestionGroupRepository } from '../../repositories';

@CommandHandler(RemoveQuestionGroupCommand)
export class RemoveQuestionGroupHandler
  implements ICommandHandler<RemoveQuestionGroupCommand>
{
  constructor(
    private readonly repository: QuestionGroupRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveQuestionGroupCommand): Promise<any> {
    Logger.log(
      'Async RemoveQuestionGroupHandler...',
      'RemoveQuestionGroupCommand',
    );
    const { questionGroupId } = command;
    const questionGroup = this.publisher.mergeObjectContext(
      await this.repository.removeQuestionGroup(questionGroupId),
    );

    return { id: questionGroup.id, success: true };
  }
}
