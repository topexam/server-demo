import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CreateQuestionCommand } from '../impl';
import { QuestionRepository } from '../../repositories';

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionHandler
  implements ICommandHandler<CreateQuestionCommand>
{
  constructor(
    private readonly repository: QuestionRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateQuestionCommand): Promise<any> {
    Logger.log('Async CreateQuestionHandler...', 'CreateQuestionCommand');
    const { examinationId, createQuestionDTO } = command;
    const question = this.publisher.mergeObjectContext(
      await this.repository.createQuestion(examinationId, createQuestionDTO),
    );

    question.createQuestion();
    question.commit();

    return { id: question.id, success: true };
  }
}
