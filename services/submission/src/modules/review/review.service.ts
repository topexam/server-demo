import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ICommandResponse,
  RpcNotFoundException,
} from '@topexam/api.lib.common';

import { DataListenerService } from '@/modules/data-listener';
import { IExaminationDocument } from '@/modules/data-listener/schemas';

import { CreateReviewCommand, UpdateReviewCommand } from './commands';
import { CreateReviewDTO, UpdateReviewDTO } from './dto';
import { GetReviewItemQuery, GetReviewListQuery } from './queries';
import { ILeanReviewDocument } from './schemas';

@Injectable()
export class ReviewService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly dataListenerSrv: DataListenerService,
  ) {}

  async getReviewList(examinationId: string): Promise<ILeanReviewDocument[]> {
    return this.queryBus.execute(new GetReviewListQuery(examinationId));
  }

  async createReview(
    examinationId: string,
    userId: string,
    createReviewDTO: CreateReviewDTO,
  ): Promise<ICommandResponse> {
    await this._getExaminationItem(examinationId);

    return this.commandBus.execute(
      new CreateReviewCommand(examinationId, userId, createReviewDTO),
    );
  }

  async updateReview(
    reviewId: string,
    userId: string,
    updateReviewDTO: UpdateReviewDTO,
  ): Promise<ICommandResponse> {
    await this._getReviewItem(reviewId, userId);

    return this.commandBus.execute(
      new UpdateReviewCommand(reviewId, userId, updateReviewDTO),
    );
  }

  private async _getReviewItem(
    reviewId: string,
    userId: string,
  ): Promise<ILeanReviewDocument> {
    const item = await this.queryBus.execute(
      new GetReviewItemQuery(reviewId, userId),
    );
    if (!item) throw new RpcNotFoundException();

    return item;
  }

  private async _getExaminationItem(
    examinationId: string,
  ): Promise<IExaminationDocument> {
    const item = await this.dataListenerSrv.getExaminationItem(examinationId);
    if (!item) throw new RpcNotFoundException();

    return item;
  }
}
