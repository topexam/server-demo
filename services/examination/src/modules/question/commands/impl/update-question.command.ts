import { ICommand } from '@nestjs/cqrs';

import { UpdateQuestionDTO } from '../../dto';

export class UpdateQuestionCommand implements ICommand {
  constructor(
    public readonly questionId: string,
    public readonly updateQuestionDTO: UpdateQuestionDTO,
  ) {}
}
