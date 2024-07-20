import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ICommandResponse } from '@topexam/api.lib.common';

import { CategoryRepository } from '../../repositories';
import { CreateCategoryCommand } from '../impl';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(
    private readonly repository: CategoryRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<ICommandResponse> {
    Logger.log('Async CreateCategoryHandler...', 'CreateCategoryCommand');
    const { createCategoryDTO } = command;
    const category = this.publisher.mergeObjectContext(
      await this.repository.createCategory(createCategoryDTO),
    );

    category.createCategory();
    category.commit();

    return { id: category.id, success: true };
  }
}
