import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  IDataExaminationExpirationEvent,
  ESubjectPattern,
  ICommandResponse,
  RpcNotFoundException,
  IApiQueryParams,
} from '@topexam/api.lib.common';

import {
  CreateSubmissionCommand,
  RequestViewAnswerCommand,
  SubmitSubmissionCommand,
} from './commands';
import { SubmitSubmissionDTO } from './dto';
import { GetSubmissionListQuery, GetSubmissionItemQuery } from './queries';
import { ILeanSubmissionDocument } from './schemas';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getSubmissionList(
    aqp: IApiQueryParams,
  ): Promise<ILeanSubmissionDocument[]> {
    return this.queryBus.execute(new GetSubmissionListQuery(aqp));
  }

  async getSubmissionItem(
    submissionId: string,
  ): Promise<ILeanSubmissionDocument> {
    return this._getSubmissionItem(submissionId);
  }

  async createSubmission(
    examinationId: string,
    playerId: string,
  ): Promise<ICommandResponse> {
    return this.commandBus.execute(
      new CreateSubmissionCommand(examinationId, playerId),
    );
  }

  async submitSubmission(
    submissionId: string,
    submitSubmissionDTO?: SubmitSubmissionDTO,
  ): Promise<ICommandResponse> {
    await this._getSubmissionItem(submissionId);
    return this.commandBus.execute(
      new SubmitSubmissionCommand(submissionId, submitSubmissionDTO),
    );
  }

  async requestViewAnswer(
    examinationId: string,
    playerId: string,
  ): Promise<ICommandResponse> {
    return this.commandBus.execute(
      new RequestViewAnswerCommand(examinationId, playerId),
    );
  }

  async _getSubmissionItem(
    submissionId: string,
  ): Promise<ILeanSubmissionDocument> {
    const item = await this.queryBus.execute(
      new GetSubmissionItemQuery(submissionId),
    );
    if (!item) throw new RpcNotFoundException();

    return item;
  }

  @EventPattern(ESubjectPattern.ExaminationExpiration)
  async examinationExpirationHandler(
    @Payload() data: IDataExaminationExpirationEvent['data'],
  ): Promise<void> {
    Logger.log(
      `Received message / ${
        ESubjectPattern.ExaminationExpiration
      } with payload: ${JSON.stringify(data)}`,
      'examinationExpirationHandler',
    );
    await this.submitSubmission(data.userExaminationId);

    Logger.log('SUCCESS');
  }
}
