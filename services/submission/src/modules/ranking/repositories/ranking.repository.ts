import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

import {
  ISubmissionDocument,
  SubmissionModel,
} from '@/modules/submission/schemas';
import { IExaminationRanking } from '../types';

export class ExaminationRankingRepository {
  constructor(
    @InjectModel(SubmissionModel.name)
    private readonly submissionModel: SoftDeleteModel<ISubmissionDocument>,
  ) {}

  async getSubmissionRankingList(
    examinationId: string,
  ): Promise<IExaminationRanking[]> {
    const rankingList = await this.submissionModel
      .aggregate<IExaminationRanking>()
      .match({
        examination: examinationId,
      })
      .sort({
        result: -1,
      })
      .group({
        _id: '$create_by_id',
        submission: { $first: '$$ROOT' },
      })
      .replaceRoot({
        submission_id: '$submission._id',
        result: '$submission.result',
        question_count: '$submission.question_count',
        start_time: '$submission.start_time',
        end_time: '$submission.end_time',
        examination_id: '$submission.examination_id',
        taker_id: '$_id',
      });

    return rankingList.map((it, index) => ({ ...it, rank: index + 1 }));
  }

  async getUserRankingItem(
    examinationId: string,
    playerId: string,
  ): Promise<IExaminationRanking> {
    const rankingList = await this.getSubmissionRankingList(examinationId);
    const rankIndex = rankingList.findIndex((it) => it.taker_id === playerId);

    return {
      ...rankingList[rankIndex],
      rank: rankIndex + 1,
    };
  }
}
