import { ICommand } from '@nestjs/cqrs';

import { CreateUserDTO } from '../../dto';

export class CreateUserCommand implements ICommand {
  constructor(public readonly createUserDTO: CreateUserDTO) {}
}
