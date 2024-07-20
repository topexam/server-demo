import { ICommand } from '@nestjs/cqrs';
import { UpdateChallengeDTO } from '../../dto';

export class UpdateChallengeCommand implements ICommand {
  constructor(
    public readonly challengeId: string,
    public readonly userId: string,
    public readonly updateChallengeDTO: UpdateChallengeDTO,
  ) {}
}
