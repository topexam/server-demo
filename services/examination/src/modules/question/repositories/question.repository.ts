import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose, { SortOrder, Types } from 'mongoose';
import { IApiQueryParams } from '@topexam/api.lib.common';

import {
  CreateBulkQuestionDTO,
  CreateQuestionDTO,
  UpdateQuestionDTO,
} from '../dto';
import { QuestionEntity } from '../entities';
import {
  FileQuestionModel,
  IFileQuestionDocument,
  ILeanFileQuestionDocument,
  ILeanNormalQuestionDocument,
  INormalQuestionDocument,
  NormalQuestionModel,
} from '../schemas';

export class QuestionRepository {
  constructor(
    @InjectModel(NormalQuestionModel.name)
    private readonly normalQuestionModel: SoftDeleteModel<INormalQuestionDocument>,
    @InjectModel(FileQuestionModel.name)
    private readonly fileQuestionModel: SoftDeleteModel<IFileQuestionDocument>,
  ) {}

  async getQuestionList(
    examinationId: string,
    hasAnswer = false,
    aqp?: IApiQueryParams,
  ): Promise<ILeanNormalQuestionDocument[]> {
    let queryBuilder = this.normalQuestionModel.find({
      ...(aqp?.filter ?? {}),
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

    return queryBuilder.select([!hasAnswer ? '-answers' : '']).lean();
  }

  async getFileQuestionList(
    examinationId: string,
    hasAnswer = false,
    aqp?: IApiQueryParams,
  ): Promise<ILeanFileQuestionDocument[]> {
    let queryBuilder = this.fileQuestionModel.find({
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

    return queryBuilder.select([!hasAnswer ? '-answers' : '']).lean();
  }

  async getQuestionItem(
    questionId: string,
  ): Promise<ILeanNormalQuestionDocument> {
    return this.normalQuestionModel.findById(questionId).lean();
  }

  async createQuestion(
    examinationId: string,
    createQuestionDTO: CreateQuestionDTO,
  ): Promise<QuestionEntity> {
    const question: INormalQuestionDocument = new this.normalQuestionModel({
      ...createQuestionDTO,
      examination_id: examinationId,
      question_group_id: createQuestionDTO.question_group_id,
    });
    await question.save();

    // Always Last
    if (createQuestionDTO.prev && !createQuestionDTO.next) {
      const prevQuestion = await this.normalQuestionModel.findById(
        createQuestionDTO.prev,
      );

      prevQuestion.set({
        next: question.id,
      });
      await prevQuestion.save();
    }

    return new QuestionEntity(question.id);
  }

  async createBulkQuestion(
    createBulkQuestionDTO: CreateBulkQuestionDTO,
  ): Promise<{ id: string }> {
    const firstQuestion = createBulkQuestionDTO.questions[0];
    await this.fileQuestionModel.deleteMany({
      examination_id: firstQuestion.examination_id,
    });
    const transformedQuestions = createBulkQuestionDTO.questions
      .map((it) => ({
        ...it,
        _id: new mongoose.Types.ObjectId(),
      }))
      .map((it, idx, list) => ({
        ...it,
        prev: list[idx - 1]?._id || null,
        next: list[idx + 1]?._id || null,
      }));

    const createdQuestions = await this.fileQuestionModel.insertMany(
      transformedQuestions,
    );

    return { id: createdQuestions?.[0]?.id };
  }

  async updateQuestion(
    questionId: string,
    updateQuestionDTO: UpdateQuestionDTO,
  ): Promise<QuestionEntity> {
    const question = await this.normalQuestionModel.findById(questionId);
    question.set(updateQuestionDTO);
    await question.save();

    // Between
    if (updateQuestionDTO.prev && updateQuestionDTO.next) {
      const prevQuestion = await this.normalQuestionModel.findById(
        updateQuestionDTO.prev,
      );
      prevQuestion.set({
        next: question.id,
      });
      await prevQuestion.save();

      const nextQuestion = await this.normalQuestionModel.findById(
        updateQuestionDTO.next,
      );
      nextQuestion.set({
        prev: question.id,
      });
      await nextQuestion.save();
    }

    // First
    if (!updateQuestionDTO.prev && updateQuestionDTO.next) {
      const nextQuestion = await this.normalQuestionModel.findById(
        updateQuestionDTO.next,
      );

      nextQuestion.set({
        prev: question.id,
      });
      await nextQuestion.save();
    }

    // Last
    if (updateQuestionDTO.prev && !updateQuestionDTO.next) {
      const prevQuestion = await this.normalQuestionModel.findById(
        updateQuestionDTO.prev,
      );

      prevQuestion.set({
        next: question.id,
      });
      await prevQuestion.save();
    }

    return new QuestionEntity(question.id);
  }

  async removeQuestion(questionId: string): Promise<QuestionEntity> {
    const question = await this.normalQuestionModel.findByIdAndDelete(
      questionId,
    );

    // Between
    if (question.prev && question.next) {
      const prevQuestion = await this.normalQuestionModel.findById(
        question.prev,
      );
      prevQuestion.set({
        next: question.next,
      });
      await prevQuestion.save();

      const nextQuestion = await this.normalQuestionModel.findById(
        question.next,
      );
      nextQuestion.set({
        prev: question.prev,
      });
      await nextQuestion.save();
    }

    // First
    if (!question.prev && question.next) {
      const nextQuestion = await this.normalQuestionModel.findById(
        question.next,
      );

      nextQuestion.set({
        prev: null,
      });
      await nextQuestion.save();
    }

    // Last
    if (question.prev && !question.next) {
      const prevQuestion = await this.normalQuestionModel.findById(
        question.prev,
      );

      prevQuestion.set({
        next: null,
      });
      await prevQuestion.save();
    }

    return new QuestionEntity(question.id);
  }
}
