import { ICommand } from '@nestjs/cqrs';

import { CreateSubCategoryDTO } from '../../dto';

export class CreateSubCategoryCommand implements ICommand {
  constructor(public readonly createSubCategoryDTO: CreateSubCategoryDTO) {}
}
