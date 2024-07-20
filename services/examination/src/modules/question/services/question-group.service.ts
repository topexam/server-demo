import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  IApiQueryParams,
  ICommandResponse,
  RpcNotFoundException,
} from '@topexam/api.lib.common';

import {
  CreateQuestionGroupCommand,
  UpdateQuestionGroupCommand,
  RemoveQuestionGroupCommand,
} from '../commands';
import { CreateQuestionGroupDTO, UpdateQuestionGroupDTO } from '../dto';
import {
  GetDefaultQuestionGroupQuery,
  GetQuestionGroupItemQuery,
  GetQuestionGroupListQuery,
} from '../queries';
import { ILeanQuestionGroupDocument } from '../schemas';

@Injectable()
export class QuestionGroupService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getQuestionGroupList(
    examinationId: string,
    aqp: IApiQueryParams,
  ): Promise<ILeanQuestionGroupDocument[]> {
    return this.queryBus.execute(
      new GetQuestionGroupListQuery(examinationId, aqp),
    );
  }

  async getDefaultGroup(
    examinationId: string,
  ): Promise<ILeanQuestionGroupDocument> {
    return this.queryBus.execute(
      new GetDefaultQuestionGroupQuery(examinationId),
    );
  }

  async createQuestionGroup(
    examinationId: string,
    createQuestionGroupDTO: CreateQuestionGroupDTO,
  ): Promise<ICommandResponse> {
    return this.commandBus.execute(
      new CreateQuestionGroupCommand(examinationId, createQuestionGroupDTO),
    );
  }

  async updateQuestionGroup(
    questionGroupId: string,
    updateQuestionGroupDTO: UpdateQuestionGroupDTO,
  ): Promise<ICommandResponse> {
    await this._getQuestionGroupItem(questionGroupId);

    return this.commandBus.execute(
      new UpdateQuestionGroupCommand(questionGroupId, updateQuestionGroupDTO),
    );
  }

  async removeQuestionGroup(
    questionGroupId: string,
  ): Promise<ICommandResponse> {
    await this._getQuestionGroupItem(questionGroupId);

    return this.commandBus.execute(
      new RemoveQuestionGroupCommand(questionGroupId),
    );
  }

  private async _getQuestionGroupItem(
    questionGroupId: string,
  ): Promise<ILeanQuestionGroupDocument> {
    const item = await this.queryBus.execute(
      new GetQuestionGroupItemQuery(questionGroupId),
    );
    if (!item) throw new RpcNotFoundException();

    return item;
  }
}
