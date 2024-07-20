import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

import { CreateCommentDTO } from '../dto';
import { IQuestionWithLatestComment } from '../types';
import { CommentEntity } from '../entities';
import {
  CommentModel,
  ICommentDocument,
  ILeanCommentDocument,
} from '../schemas';
import { convertListToLinkList } from '@/modules/examination';

export class CommentRepository {
  constructor(
    @InjectModel(CommentModel.name)
    private readonly commentModel: SoftDeleteModel<ICommentDocument>,
  ) {}

  async getCommentList(questionId: string): Promise<ILeanCommentDocument[]> {
    return this.commentModel.find({ question_id: questionId }).lean();
  }

  async getQuestionListWithLatestComment(
    examinationId: string,
  ): Promise<IQuestionWithLatestComment[]> {
    const questionListWithLatestComment = await this.commentModel
      .aggregate()
      .match({
        examination_id: examinationId,
      })
      .sort({
        _created: -1,
      })
      .lookup({
        from: 'questions',
        localField: 'question_id',
        foreignField: '_id',
        as: 'questionData',
      })
      .group({
        _id: '$question_id',
        comment: { $first: '$$ROOT' },
        comment_count: { $sum: 1 },
      })
      .replaceRoot({
        newRoot: {
          $mergeObjects: [
            '$$ROOT',
            { $arrayElemAt: ['$comment.$questionData', 0] },
          ],
        },
      })
      .project({
        '$comment.$questionData': 0,
      });

    return convertListToLinkList(questionListWithLatestComment, []).reverse();
  }

  async getCommentItem(commentId: string): Promise<ILeanCommentDocument> {
    return this.commentModel.findById(commentId).lean();
  }

  async createComment(
    questionId: string,
    commenterId: string,
    createCommentDTO: CreateCommentDTO,
  ): Promise<CommentEntity> {
    const data = {
      ...createCommentDTO,
      question_id: questionId,
      commenter_id: commenterId,
      examination_id: createCommentDTO.examination_id,
    };
    const commentCreated = new this.commentModel(data);
    await commentCreated.save();
    return new CommentEntity(commentCreated.id);
  }
}
