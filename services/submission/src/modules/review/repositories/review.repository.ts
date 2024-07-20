import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

import { CreateReviewDTO, UpdateReviewDTO } from '../dto';
import { ReviewEntity } from '../entities';
import { ILeanReviewDocument, IReviewDocument, ReviewModel } from '../schemas';

export class ReviewRepository {
  constructor(
    @InjectModel(ReviewModel.name)
    private readonly reviewModel: SoftDeleteModel<IReviewDocument>,
  ) {}

  async getReviewList(examinationId: string): Promise<ILeanReviewDocument[]> {
    return this.reviewModel.find({ examination_id: examinationId });
  }

  async getReviewItem(
    reviewId: string,
    userId?: string,
  ): Promise<ILeanReviewDocument> {
    const filterCons = { _id: reviewId };
    if (userId) filterCons['reviewer_id'] = userId;

    return this.reviewModel.findOne(filterCons);
  }

  async createReview(
    examinationId: string,
    userId: string,
    createReviewDTO: CreateReviewDTO,
  ): Promise<ReviewEntity> {
    const data = {
      ...createReviewDTO,
      reviewer_id: userId,
      examination_id: examinationId,
    };
    const reviewCreated = new this.reviewModel(data);
    await reviewCreated.save();
    return new ReviewEntity(reviewCreated.id);
  }

  async updateReview(
    reviewId: string,
    userId: string,
    updateReviewDTO: UpdateReviewDTO,
  ): Promise<ReviewEntity> {
    const review = await this.reviewModel.findOne({
      _id: reviewId,
      reviewer_id: userId,
    });
    if (updateReviewDTO.content) {
      review.content = updateReviewDTO.content;
    }

    if (updateReviewDTO.rating) {
      review.rating = updateReviewDTO.rating;
    }

    await review.save();

    return new ReviewEntity(review.id);
  }
}
