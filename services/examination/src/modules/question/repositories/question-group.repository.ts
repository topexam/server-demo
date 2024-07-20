import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { IApiQueryParams } from '@topexam/api.lib.common';
import { SortOrder, Types } from 'mongoose';

import { CreateQuestionGroupDTO, UpdateQuestionGroupDTO } from '../dto';
import { QuestionGroupEntity } from '../entities';
import {
  ILeanQuestionGroupDocument,
  IQuestionGroupDocument,
  QuestionGroupModel,
} from '../schemas';

export class QuestionGroupRepository {
  constructor(
    @InjectModel(QuestionGroupModel.name)
    private readonly questionGroupModel: SoftDeleteModel<IQuestionGroupDocument>,
  ) {}

  async getQuestionGroupList(
    examinationId: string,
    aqp: IApiQueryParams,
  ): Promise<ILeanQuestionGroupDocument[]> {
    let queryBuilder = this.questionGroupModel.find({
      ...aqp.filter,
      _id: {
        $gte: aqp.pagination.page_token
          ? Types.ObjectId.createFromHexString(aqp.pagination.page_token)
          : null,
      },
      examination_id: examinationId,
    });
    if (aqp?.sort) {
      queryBuilder = queryBuilder.sort(aqp?.sort as Record<string, SortOrder>);
    }
    if (aqp?.pagination) {
      queryBuilder = queryBuilder.limit(aqp?.pagination.page_size);
    }

    return queryBuilder.lean();
  }

  async getQuestionGroupItem(
    questionGroupId: string,
  ): Promise<ILeanQuestionGroupDocument> {
    return this.questionGroupModel.findById(questionGroupId).lean();
  }

  async getDefaultQuestionGroup(
    examinationId: string,
  ): Promise<ILeanQuestionGroupDocument> {
    return this.questionGroupModel
      .findOne({
        examination: examinationId,
        is_default: true,
      })
      .lean();
  }

  async createQuestionGroup(
    examinationId: string,
    createQuestionGroupDTO: CreateQuestionGroupDTO,
  ): Promise<QuestionGroupEntity> {
    const questionGroup: IQuestionGroupDocument = new this.questionGroupModel({
      ...createQuestionGroupDTO,
      examination_id: examinationId,
    });
    await questionGroup.save();
    return new QuestionGroupEntity(questionGroup.id);
  }

  async updateQuestionGroup(
    questionGroupId: string,
    updateQuestionGroupDTO: UpdateQuestionGroupDTO,
  ): Promise<QuestionGroupEntity> {
    const questionGroup = await this.questionGroupModel.findById(
      questionGroupId,
    );
    if (!questionGroup) throw new NotFoundException();

    questionGroup.set(updateQuestionGroupDTO);
    await questionGroup.save();

    return new QuestionGroupEntity(questionGroup.id);
  }

  async removeQuestionGroup(
    questionGroupId: string,
  ): Promise<QuestionGroupEntity> {
    await this.questionGroupModel.deleteById(questionGroupId);
    return new QuestionGroupEntity(questionGroupId);
  }
}
