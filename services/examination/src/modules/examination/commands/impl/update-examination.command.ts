import { ICommand } from '@nestjs/cqrs';

import { UpdateExaminationDTO } from '../../dto';

export class UpdateExaminationCommand implements ICommand {
  constructor(
    public readonly examinationId: string,
    public readonly updateExaminationDTO: UpdateExaminationDTO,
  ) {}
}
