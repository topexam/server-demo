import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { UpdateQuestionGroupCommand } from '../impl';
import { QuestionGroupRepository } from '../../repositories';

@CommandHandler(UpdateQuestionGroupCommand)
export class UpdateQuestionGroupHandler
  implements ICommandHandler<UpdateQuestionGroupCommand>
{
  constructor(
    private readonly repository: QuestionGroupRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateQuestionGroupCommand): Promise<any> {
    Logger.log(
      'Async UpdateQuestionGroupHandler...',
      'UpdateQuestionGroupCommand',
    );
    const { questionGroupId, updateQuestionGroupDTO } = command;
    const questionGroup = this.publisher.mergeObjectContext(
      await this.repository.updateQuestionGroup(
        questionGroupId,
        updateQuestionGroupDTO,
      ),
    );

    return { id: questionGroup.id, success: true };
  }
}
