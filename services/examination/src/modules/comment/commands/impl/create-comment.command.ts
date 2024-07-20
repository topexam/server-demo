import { ICommand } from '@nestjs/cqrs';

import { CreateCommentDTO } from '../../dto';

export class CreateCommentCommand implements ICommand {
  constructor(
    public readonly questionId: string,
    public readonly commenterId: string,
    public readonly createCommentDTO: CreateCommentDTO,
  ) {}
}
