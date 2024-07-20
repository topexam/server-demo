import { ICommand } from '@nestjs/cqrs';

export class DeleteChallengeCommand implements ICommand {
  constructor(
    public readonly challengeId: string,
    public readonly userId: string,
  ) {}
}
