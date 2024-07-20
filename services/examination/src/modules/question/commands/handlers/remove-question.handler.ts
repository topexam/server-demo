import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { RemoveQuestionCommand } from '../impl';
import { QuestionRepository } from '../../repositories';

@CommandHandler(RemoveQuestionCommand)
export class RemoveQuestionHandler
  implements ICommandHandler<RemoveQuestionCommand>
{
  constructor(
    private readonly repository: QuestionRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveQuestionCommand): Promise<any> {
    Logger.log('Async RemoveQuestionHandler...', 'RemoveQuestionCommand');
    const { questionId } = command;
    const question = this.publisher.mergeObjectContext(
      await this.repository.removeQuestion(questionId),
    );

    return { id: question.id, success: true };
  }
}
