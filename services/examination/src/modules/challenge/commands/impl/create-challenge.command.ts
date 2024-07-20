import { ICommand } from '@nestjs/cqrs';
import { CreateChallengeDTO } from '../../dto';

export class CreateChallengeCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly createChallengeDTO: CreateChallengeDTO,
  ) {}
}
