import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CreateSubCategoryCommand } from '../impl';
import { SubCategoryRepository } from '../../repositories';

@CommandHandler(CreateSubCategoryCommand)
export class CreateSubCategoryHandler
  implements ICommandHandler<CreateSubCategoryCommand>
{
  constructor(private readonly repository: SubCategoryRepository) {}

  async execute(command: CreateSubCategoryCommand): Promise<void> {
    Logger.log('Async CreateSubCategoryHandler...', 'CreateSubCategoryCommand');
    const { createSubCategoryDTO } = command;
    await this.repository.createSubCategory(createSubCategoryDTO);
  }
}
