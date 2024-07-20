import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { UpdateQuestionCommand } from '../impl';
import { QuestionRepository } from '../../repositories';

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionHandler
  implements ICommandHandler<UpdateQuestionCommand>
{
  constructor(
    private readonly repository: QuestionRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateQuestionCommand): Promise<any> {
    Logger.log('Async UpdateQuestionHandler...', 'UpdateQuestionCommand');
    const { questionId, updateQuestionDTO } = command;
    const question = this.publisher.mergeObjectContext(
      await this.repository.updateQuestion(questionId, updateQuestionDTO),
    );

    return { id: question.id, success: true };
  }
}
