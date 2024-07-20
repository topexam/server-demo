import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  IApiQueryParams,
  ICommandResponse,
  RpcNotFoundException,
} from '@topexam/api.lib.common';

import {
  CreateChallengeCommand,
  DeleteChallengeCommand,
  UpdateChallengeCommand,
} from './commands';
import { CreateChallengeDTO, UpdateChallengeDTO } from './dto';
import { GetChallengeItemQuery, GetChallengeListQuery } from './queries';
import { ILeanChallengeDocument } from './schemas';

@Injectable()
export class ChallengeService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getChallengeList(
    aqp: IApiQueryParams,
  ): Promise<ILeanChallengeDocument[]> {
    return this.queryBus.execute(new GetChallengeListQuery(aqp));
  }

  async getChallengeItem(
    challengeId: string,
    userId?: string,
  ): Promise<ILeanChallengeDocument> {
    const challengeItem = await this.queryBus.execute(
      new GetChallengeItemQuery(challengeId, userId),
    );
    if (!challengeItem) throw new RpcNotFoundException();

    return challengeItem;
  }

  async createChallenge(
    userId: string,
    createChallengeDTO: CreateChallengeDTO,
  ): Promise<ICommandResponse> {
    const response = await this.commandBus.execute(
      new CreateChallengeCommand(userId, createChallengeDTO),
    );
    return response;
  }

  async updateChallenge(
    challengeId: string,
    userId: string,
    updateChallengeDTO: UpdateChallengeDTO,
  ): Promise<ICommandResponse> {
    await this.getChallengeItem(challengeId, userId);

    const response = await this.commandBus.execute(
      new UpdateChallengeCommand(challengeId, userId, updateChallengeDTO),
    );
    return response;
  }

  async deleteChallenge(
    challengeId: string,
    userId: string,
  ): Promise<ICommandResponse> {
    await this.getChallengeItem(challengeId, userId);

    const response = await this.commandBus.execute(
      new DeleteChallengeCommand(challengeId, userId),
    );
    return response;
  }
}
