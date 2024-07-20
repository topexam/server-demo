import { ICommand } from '@nestjs/cqrs';

import { CreateTagDTO } from '../../dto';

export class CreateTagCommand implements ICommand {
  constructor(public readonly createTagDTO: CreateTagDTO) {}
}
