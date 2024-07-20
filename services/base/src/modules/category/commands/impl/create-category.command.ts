import { ICommand } from '@nestjs/cqrs';
import { CreateCategoryDTO } from '../../dto';

export class CreateCategoryCommand implements ICommand {
  constructor(public readonly createCategoryDTO: CreateCategoryDTO) {}
}
