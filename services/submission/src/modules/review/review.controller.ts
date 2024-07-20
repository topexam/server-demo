import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import {
  CustomRpcExceptionFilter,
  ICommandResponse,
  TransformInterceptor,
} from '@topexam/api.lib.common';
import {
  CreateReviewRequest,
  GetReviewListRequest,
  ReviewServiceController,
  ReviewServiceControllerMethods,
  UpdateReviewRequest,
} from '@topexam/api.service.proto/dist/__generated__/review.pb';

import { ReviewService } from './review.service';

@UseInterceptors(new TransformInterceptor())
@UseFilters(new CustomRpcExceptionFilter())
@Controller()
@ReviewServiceControllerMethods()
export class ReviewController implements ReviewServiceController {
  constructor(private readonly reviewService: ReviewService) {}

  async getReviewList(request: GetReviewListRequest) {
    const reviewList = await this.reviewService.getReviewList(
      request.examinationId,
    );

    return {
      data: reviewList,
      meta: {
        next_page_token: null,
        total: 0,
      },
    };
  }

  createReview(request: CreateReviewRequest): Promise<ICommandResponse> {
    return this.reviewService.createReview(
      request.examinationId,
      request.userId,
      request.data,
    );
  }

  updateReview(request: UpdateReviewRequest): Promise<ICommandResponse> {
    return this.reviewService.updateReview(
      request.reviewId,
      request.userId,
      request.data,
    );
  }
}
