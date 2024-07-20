import { ICommand } from '@nestjs/cqrs';

import { UpdateQuestionGroupDTO } from '../../dto';

export class UpdateQuestionGroupCommand implements ICommand {
  constructor(
    public readonly questionGroupId: string,
    public readonly updateQuestionGroupDTO: UpdateQuestionGroupDTO,
  ) {}
}
