import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  RpcNotFoundException,
  ICommandResponse,
  IApiQueryParams,
} from '@topexam/api.lib.common';

import { CreateTagCommand } from './commands';
import { GetTagItemQuery, GetTagListQuery } from './queries';
import { CreateTagDTO } from './dto';
import { ILeanTagDocument } from './schemas';

@Injectable()
export class TagService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getTagList(aqp: IApiQueryParams): Promise<ILeanTagDocument[]> {
    return this.queryBus.execute(new GetTagListQuery(aqp));
  }

  async getTagItem(tagId: string): Promise<ILeanTagDocument> {
    const tagItem = await this.queryBus.execute(new GetTagItemQuery(tagId));
    if (!tagItem) throw new RpcNotFoundException();
    return tagItem;
  }

  async createTag(createTagDTO: CreateTagDTO): Promise<ICommandResponse> {
    return this.commandBus.execute(new CreateTagCommand(createTagDTO));
  }
}
