import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateExaminationDTO } from './dto';
import { CreateExaminationCommand } from './commands';
import { IExaminationDocument } from './schemas';
import { GetExaminationItemQuery } from './queries';

@Injectable()
export class DataListenerService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async createExaminationFromEvent(data: CreateExaminationDTO): Promise<void> {
    const createExaminationDTO: CreateExaminationDTO = data;
    await this.commandBus.execute(
      new CreateExaminationCommand(createExaminationDTO),
    );
  }

  async getExaminationItem(
    examinationId: string,
  ): Promise<IExaminationDocument> {
    return this.queryBus.execute(new GetExaminationItemQuery(examinationId));
  }
}
