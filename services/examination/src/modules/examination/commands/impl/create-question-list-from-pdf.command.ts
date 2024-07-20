import { ICommand } from '@nestjs/cqrs';

import { CreateQuestionListFromFileDTO } from '../../dto';

export class CreateQuestionListFromFileCommand implements ICommand {
  constructor(
    public readonly examinationId: string,
    public readonly createQuestionListFromFileDTO: CreateQuestionListFromFileDTO,
  ) {}
}
