import { ICommand } from '@nestjs/cqrs';

import { CreateBulkQuestionDTO } from '../../dto';

export class CreateBulkQuestionCommand implements ICommand {
  constructor(public readonly createBulkQuestionDTO: CreateBulkQuestionDTO) {}
}
