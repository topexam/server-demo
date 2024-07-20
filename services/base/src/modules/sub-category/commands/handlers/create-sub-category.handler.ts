import { ICommandResponse } from '@topexam/api.lib.common';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { SubCategoryRepository } from '../../repositories';
import { CreateSubCategoryCommand } from '../impl';

@CommandHandler(CreateSubCategoryCommand)
export class CreateSubCategoryHandler
  implements ICommandHandler<CreateSubCategoryCommand>
{
  constructor(
    private readonly repository: SubCategoryRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateSubCategoryCommand): Promise<ICommandResponse> {
    Logger.log('Async CreateSubCategoryHandler...', 'CreateSubCategoryCommand');
    const { createSubCategoryDTO } = command;
    const subCategory = this.publisher.mergeObjectContext(
      await this.repository.createSubCategory(createSubCategoryDTO),
    );

    subCategory.createSubCategory();
    subCategory.commit();

    return { id: subCategory.id, success: true };
  }
}
