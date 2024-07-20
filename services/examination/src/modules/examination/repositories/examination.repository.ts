import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { IApiQueryParams } from '@topexam/api.lib.common';
import { SortOrder, Types } from 'mongoose';

import { ECommandAction } from '@/enums';
import {
  CreateExaminationDTOWithAuthor,
  CreateQuestionListFromFileDTO,
  UpdateExaminationDTO,
} from '../dto';
import {
  ExaminationModel,
  IExaminationDocument,
  ILeanExaminationDocument,
} from '../schemas';
import {
  ECountPropertyKey,
  EExaminationMode,
  EExaminationStatus,
} from '../enums';
import { ExaminationEntity } from '../entities';

export class ExaminationRepository {
  constructor(
    @InjectModel(ExaminationModel.name)
    private readonly examinationModel: SoftDeleteModel<IExaminationDocument>,
  ) {}

  async getExaminationList(
    aqp: IApiQueryParams,
  ): Promise<ILeanExaminationDocument[]> {
    let otherFilter: Record<string, any> = {};
    if (aqp.q) {
      otherFilter = {
        ...otherFilter,
        $text: { $search: aqp.q },
      };
    }

    return this.examinationModel
      .find({
        ...aqp.filter,
        _id: {
          $gte: aqp.pagination.page_token
            ? Types.ObjectId.createFromHexString(aqp.pagination.page_token)
            : null,
        },
        ...otherFilter,
      })
      .sort(aqp.sort as Record<string, SortOrder>)
      .limit(aqp.pagination.page_size)
      .populate(['sub_category', 'tags', 'author'])
      .lean();
  }

  async getExaminationListRecommended(
    userId: string,
    aqp: IApiQueryParams,
  ): Promise<ILeanExaminationDocument[]> {
    let otherFilter: Record<string, any> = {};
    if (aqp.q) {
      otherFilter = {
        ...otherFilter,
        $text: { $search: aqp.q },
      };
    }

    return this.examinationModel
      .find({
        ...aqp.filter,
        _id: {
          $gte: aqp.pagination.page_token
            ? Types.ObjectId.createFromHexString(aqp.pagination.page_token)
            : null,
        },
        ...otherFilter,
      })
      .sort(aqp.sort as Record<string, SortOrder>)
      .limit(aqp.pagination.page_size)
      .populate(['sub_category', 'tags', 'author'])
      .lean();
  }

  async getExaminationListRelated(
    examinationId: string,
    aqp: IApiQueryParams,
  ): Promise<ILeanExaminationDocument[]> {
    let otherFilter: Record<string, any> = {};
    if (aqp.q) {
      otherFilter = {
        ...otherFilter,
        $text: { $search: aqp.q },
      };
    }

    return this.examinationModel
      .find({
        ...aqp.filter,
        _id: {
          $gte: aqp.pagination.page_token
            ? Types.ObjectId.createFromHexString(aqp.pagination.page_token)
            : null,
        },
        ...otherFilter,
      })
      .sort(aqp.sort as Record<string, SortOrder>)
      .limit(aqp.pagination.page_size)
      .populate(['sub_category', 'tags', 'author'])
      .lean();
  }

  async getExaminationItem(
    examinationId: string,
  ): Promise<ILeanExaminationDocument> {
    return this.examinationModel
      .findById(examinationId)
      .populate(['sub_category', 'tags', 'author'])
      .lean();
  }

  async createExamination(
    createExaminationDTO: CreateExaminationDTOWithAuthor,
  ): Promise<ExaminationEntity> {
    const examinationCreated = await new this.examinationModel({
      ...createExaminationDTO,
      sub_category_id: createExaminationDTO.sub_category_id,
      tag_ids: createExaminationDTO.tag_ids,
      author_id: createExaminationDTO.author_id,
    }).save();
    return new ExaminationEntity(examinationCreated.id);
  }

  async updateExamination(
    examinationId: string,
    updateExaminationDTO: UpdateExaminationDTO,
  ): Promise<ExaminationEntity> {
    const examination = await this.examinationModel.findById(examinationId);
    examination.set({
      ...updateExaminationDTO,
      tag_ids: updateExaminationDTO.tag_ids,
    });
    if (updateExaminationDTO.sub_category_id) {
      examination.set({
        sub_category_id: updateExaminationDTO.sub_category_id,
      });
    }

    await examination.save();

    return new ExaminationEntity(examination.id);
  }

  async updateQuestionListFromPDF(
    examinationId: string,
    createQuestionListFromFileDTO: CreateQuestionListFromFileDTO,
  ): Promise<ExaminationEntity> {
    const examination = await this.examinationModel.findById(examinationId);
    examination.set({
      mode: EExaminationMode.PDF,
      file: createQuestionListFromFileDTO.file,
      question_count: createQuestionListFromFileDTO.question_count,
    });
    await examination.save();

    return new ExaminationEntity(examination.id);
  }

  async updateQuestionNumForExamination(
    examinationId: string,
    action: ECommandAction,
  ): Promise<ExaminationEntity> {
    const examination = await this.examinationModel.findByIdAndUpdate(
      examinationId,
      {
        $inc: {
          question_count: action === ECommandAction.ADDED ? 1 : -1,
        },
      },
    );

    return new ExaminationEntity(examination.id);
  }

  async deleteExamination(examinationId: string): Promise<ExaminationEntity> {
    await this.examinationModel.deleteById(examinationId);

    return new ExaminationEntity(examinationId);
  }

  async publishExamination(examinationId: string): Promise<ExaminationEntity> {
    const examination = await this.examinationModel.findById(examinationId);

    examination.set({
      status: EExaminationStatus.PUBLIC,
    });
    await examination.save();

    return new ExaminationEntity(examination.id);
  }

  async countExaminationProperty(
    examinationId: string,
    propertyKey: ECountPropertyKey,
  ): Promise<ExaminationEntity> {
    const examination = await this.examinationModel.findByIdAndUpdate(
      examinationId,
      {
        $inc: { [propertyKey]: 1 },
      },
    );

    return new ExaminationEntity(examination.id);
  }

  async updateExaminationRating(
    examinationId: string,
    resultRating: number,
  ): Promise<ExaminationEntity> {
    const examination = await this.examinationModel.findById(examinationId);

    examination.set({ rating: resultRating });
    await examination.save();

    return new ExaminationEntity(examination.id);
  }
}
