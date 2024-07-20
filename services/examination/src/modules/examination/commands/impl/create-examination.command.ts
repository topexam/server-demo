import { ICommand } from '@nestjs/cqrs';

import { CreateExaminationDTOWithAuthor } from '../../dto';

export class CreateExaminationCommand implements ICommand {
  constructor(
    public readonly createExaminationDTO: CreateExaminationDTOWithAuthor,
  ) {}
}
