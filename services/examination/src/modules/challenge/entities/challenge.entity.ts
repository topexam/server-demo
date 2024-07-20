import { AggregateRoot } from '@nestjs/cqrs';

import { ChallengeCreatedEvent } from '../events/impl';
import { CreateChallengeDTO } from '../dto';

export class ChallengeEntity extends AggregateRoot {
  constructor(readonly id: string) {
    super();
  }

  createChallenge(
    userId: string,
    createChallengeDTO: CreateChallengeDTO,
  ): void {
    this.apply(new ChallengeCreatedEvent(this.id, userId, createChallengeDTO));
  }
}
