import { ICommand } from '@nestjs/cqrs';

import { CreateQuestionDTO } from '../../dto';

export class CreateQuestionCommand implements ICommand {
  constructor(
    public readonly examinationId: string,
    public readonly createQuestionDTO: CreateQuestionDTO,
  ) {}
}
