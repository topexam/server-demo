import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  IDataSubCategoryCreatedEvent,
  IDataTagCreatedEvent,
  IDataUserCreatedEvent,
} from '@topexam/api.lib.common';

import {
  CreateSubCategoryCommand,
  CreateTagCommand,
  CreateUserCommand,
} from './commands';
import {
  GetSubCategoryItemQuery,
  GetTagItemQuery,
  GetUserItemQuery,
} from './queries';
import {
  ILeanSubCategoryDocument,
  ILeanTagDocument,
  ILeanUserDocument,
} from './schemas';
import { CreateSubCategoryDTO, CreateTagDTO, CreateUserDTO } from './dto';

@Injectable()
export class DataListenerService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getSubCategoryItem(
    subCategoryId: string,
  ): Promise<ILeanSubCategoryDocument> {
    return this.queryBus.execute(new GetSubCategoryItemQuery(subCategoryId));
  }

  async getTagItem(tagId: string): Promise<ILeanTagDocument> {
    return this.queryBus.execute(new GetTagItemQuery(tagId));
  }

  async getUserItem(userId: string): Promise<ILeanUserDocument> {
    return this.queryBus.execute(new GetUserItemQuery(userId));
  }

  async createUserFromEvent(
    data: IDataUserCreatedEvent['data'],
  ): Promise<void> {
    const createUserDTO: CreateUserDTO = data;
    await this.commandBus.execute(new CreateUserCommand(createUserDTO));
  }

  async createTagFromEvent(data: IDataTagCreatedEvent['data']): Promise<void> {
    const createTagDTO: CreateTagDTO = data;
    await this.commandBus.execute(new CreateTagCommand(createTagDTO));
  }

  async createSubCategoryFromEvent(
    data: IDataSubCategoryCreatedEvent['data'],
  ): Promise<void> {
    const createSubCategoryDTO: CreateSubCategoryDTO = data;
    await this.commandBus.execute(
      new CreateSubCategoryCommand(createSubCategoryDTO),
    );
  }
}
