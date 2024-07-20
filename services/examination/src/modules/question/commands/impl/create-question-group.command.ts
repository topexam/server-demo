import { ICommand } from '@nestjs/cqrs';

import { CreateQuestionGroupDTO } from '../../dto';

export class CreateQuestionGroupCommand implements ICommand {
  constructor(
    public readonly examinationId: string,
    public readonly createQuestionGroupDTO: CreateQuestionGroupDTO,
  ) {}
}
