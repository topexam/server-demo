import { IQuery } from '@nestjs/cqrs';

export class GetChallengeItemQuery implements IQuery {
  constructor(
    public readonly challengeId: string,
    public readonly userId?: string,
  ) {}
}
