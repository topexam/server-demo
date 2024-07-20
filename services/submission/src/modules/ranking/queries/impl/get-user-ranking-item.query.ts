import { IQuery } from '@nestjs/cqrs';

export class GetUserRankingItemQuery implements IQuery {
  constructor(readonly examinationId: string, readonly playerId: string) {}
}
