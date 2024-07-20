import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { FilterQuery, SortOrder, Types } from 'mongoose';
import { IApiQueryParams } from '@topexam/api.lib.common';

import {
  ChallengeModel,
  IChallengeDocument,
  ILeanChallengeDocument,
} from '../schemas';
import { CreateChallengeDTO, UpdateChallengeDTO } from '../dto';
import { ChallengeEntity } from '../entities';

export class ChallengeRepository {
  constructor(
    @InjectModel(ChallengeModel.name)
    private readonly challengeModel: SoftDeleteModel<IChallengeDocument>,
  ) {}

  async getChallengeList(
    aqp: IApiQueryParams,
  ): Promise<ILeanChallengeDocument[]> {
    return this.challengeModel
      .find({
        ...aqp.filter,
        _id: {
          $gte: aqp.pagination.page_token
            ? Types.ObjectId.createFromHexString(aqp.pagination.page_token)
            : null,
        },
      })
      .sort(aqp.sort as Record<string, SortOrder>)
      .limit(aqp.pagination.page_size)
      .populate('examination')
      .lean();
  }

  async getChallengeItem(
    challengeId: string,
    userId?: string,
  ): Promise<ILeanChallengeDocument> {
    const filter: FilterQuery<ILeanChallengeDocument> = { _id: challengeId };
    if (userId) filter.created_by_id = userId;

    return this.challengeModel.findOne(filter).lean();
  }

  async createChallenge(
    userId: string,
    createChallengeDTO: CreateChallengeDTO,
  ): Promise<ChallengeEntity> {
    const challenge = new this.challengeModel({
      ...createChallengeDTO,
      created_by_id: userId,
    });

    await challenge.save();
    return new ChallengeEntity(challenge.id);
  }

  async updateChallenge(
    challengeId: string,
    userId: string,
    updateChallengeDTO: UpdateChallengeDTO,
  ): Promise<ChallengeEntity> {
    await this.challengeModel.findOneAndUpdate(
      { _id: challengeId, created_by_id: userId },
      {
        ...updateChallengeDTO,
        updated_by_id: userId,
      },
    );

    return new ChallengeEntity(challengeId);
  }

  async deleteChallenge(
    challengeId: string,
    userId: string,
  ): Promise<ChallengeEntity> {
    await this.challengeModel.findOneAndDelete({
      _id: challengeId,
      created_by_id: userId,
    });

    return new ChallengeEntity(challengeId);
  }
}
