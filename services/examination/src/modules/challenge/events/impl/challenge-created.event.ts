import { IEvent } from '@nestjs/cqrs';
import { CreateChallengeDTO } from '../../dto';

export class ChallengeCreatedEvent implements IEvent {
  constructor(
    public readonly challengeId: string,
    public readonly userId: string,
    public readonly createChallengeDTO: CreateChallengeDTO,
  ) {}
}
