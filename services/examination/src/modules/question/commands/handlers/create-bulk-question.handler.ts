import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CreateBulkQuestionCommand } from '../impl';
import { QuestionRepository } from '../../repositories';

@CommandHandler(CreateBulkQuestionCommand)
export class CreateBulkQuestionHandler
  implements ICommandHandler<CreateBulkQuestionCommand>
{
  constructor(
    private readonly repository: QuestionRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateBulkQuestionCommand): Promise<any> {
    Logger.log(
      'Async CreateBulkQuestionHandler...',
      'CreateBulkQuestionCommand',
    );
    const { createBulkQuestionDTO } = command;
    const firstQuestion = await this.repository.createBulkQuestion(
      createBulkQuestionDTO,
    );

    return { id: firstQuestion.id, success: true };
  }
}
