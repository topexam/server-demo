import { ICommand } from '@nestjs/cqrs';

import { CreateExaminationDTO } from '../../dto';

export class CreateExaminationCommand implements ICommand {
  constructor(public readonly createExaminationDTO: CreateExaminationDTO) {}
}
