import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ICommandResponse } from '@topexam/api.lib.common';

import { ECommandAction } from '@/enums';
import { CategoryRepository } from '../../repositories';
import { UpdateSubCategoryCommand } from '../impl';

@CommandHandler(UpdateSubCategoryCommand)
export class UpdateSubCategoryHandler
  implements ICommandHandler<UpdateSubCategoryCommand>
{
  constructor(
    private readonly repository: CategoryRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateSubCategoryCommand): Promise<ICommandResponse> {
    Logger.log('Async UpdateSubCategoryHandler...', 'UpdateSubCategoryCommand');
    const {
      categoryId,
      data: { subCategoryId, action },
    } = command;
    let category;
    if (action === ECommandAction.ADDED) {
      category = this.publisher.mergeObjectContext(
        await this.repository.addSubCategoryToCategory(
          categoryId,
          subCategoryId,
        ),
      );
    }

    if (action === ECommandAction.REMOVED) {
      category = this.publisher.mergeObjectContext(
        await this.repository.removeSubCategoryFromCategory(
          categoryId,
          subCategoryId,
        ),
      );
    }

    return { id: category.id, success: true };
  }
}
