import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import {
  IApiQueryParams,
  RpcBadRequestException,
} from '@topexam/api.lib.common';

import { ExaminationRepository } from '@/modules/data-listener';

import { SubmitSubmissionDTO } from '../dto';
import { SubmissionEntity } from '../entities';
import {
  ILeanSubmissionDocument,
  ISubmissionDocument,
  SubmissionModel,
} from '../schemas';
import { ESubmissionStatus } from '../enums';
import { calculateSubmissionScore } from '../utils';
import { SortOrder, Types } from 'mongoose';

export class SubmissionRepository {
  constructor(
    @InjectModel(SubmissionModel.name)
    private readonly submissionModel: SoftDeleteModel<ISubmissionDocument>,
    private readonly examinationRepository: ExaminationRepository,
  ) {}

  async getSubmissionList(
    aqp: IApiQueryParams,
  ): Promise<ILeanSubmissionDocument[]> {
    let otherFilter: Record<string, any> = {};
    if (aqp.q) {
      otherFilter = {
        ...otherFilter,
        $text: { $search: aqp.q },
      };
    }

    return this.submissionModel
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
      .populate(['examination'])
      .lean();
  }

  async getSubmissionItem(
    submissionId: string,
  ): Promise<ILeanSubmissionDocument> {
    const submissionItem: ILeanSubmissionDocument = await this.submissionModel
      .findById(submissionId)
      .lean();

    if (!submissionItem.view_answer) {
      return submissionItem;
    }

    const examination = await this.examinationRepository.getExaminationItem(
      submissionItem.examination_id,
    );
    submissionItem.answers = examination.answers.map(
      ({ question, ...rest }) => ({
        ...rest,
        question_id: question,
      }),
    );
    return submissionItem;
  }

  async createSubmission(
    examinationId: string,
    playerId: string,
  ): Promise<SubmissionEntity> {
    const examination = await this.examinationRepository.getExaminationItem(
      examinationId,
    );

    const submissionCreated = new this.submissionModel({
      start_time: new Date(),
      examination_id: examinationId,
      question_count: examination.question_count,
      player_id: playerId,
    });

    await submissionCreated.save();
    return new SubmissionEntity(submissionCreated.id);
  }

  async submitSubmission(
    submissionId: string,
    submitSubmissionDTO?: SubmitSubmissionDTO,
  ): Promise<SubmissionEntity> {
    const submission = await this.submissionModel.findById(submissionId);

    if (submission.status === ESubmissionStatus.FINISHED) {
      throw new RpcBadRequestException({
        message: 'Can not submit submission!',
      });
    }

    const examination = await this.examinationRepository.getExaminationItem(
      submission.examination_id,
    );

    let updateData: Record<string, any> = {
      ...submitSubmissionDTO,
      status: ESubmissionStatus.FINISHED,
      end_time: new Date(),
      answers: examination.answers,
    };

    if (submitSubmissionDTO) {
      const userAnswers = submitSubmissionDTO.user_answers;
      const examinationAnswers = examination.answers;

      const result = examinationAnswers.reduce((result, examinationOption) => {
        userAnswers.forEach((userOption) => {
          if (examinationOption.question === userOption.question) {
            result += calculateSubmissionScore(
              examinationOption.options,
              userOption.options,
            );
          }
        });
        return result;
      }, 0);

      updateData = {
        ...updateData,
        result,
      };
    }

    submission.set(updateData);

    await submission.save();
    return new SubmissionEntity(submission.id);
  }

  async requestViewAnswer(
    examinationId: string,
    playerId: string,
  ): Promise<boolean> {
    const submission = await this.submissionModel.updateMany(
      { examination_id: examinationId, player_id: playerId },
      { $set: { view_answer: new Date() } },
    );

    return !!submission.acknowledged;
  }
}
