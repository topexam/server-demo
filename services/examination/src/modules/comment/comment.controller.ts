import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import {
  CustomRpcExceptionFilter,
  TransformInterceptor,
} from '@topexam/api.lib.common';
import {
  CommentServiceController,
  CommentServiceControllerMethods,
  CreateCommentRequest,
  GetCommentListRequest,
  GetQuestionListWithLatestCommentRequest,
} from '@topexam/api.service.proto/dist/__generated__/comment.pb';

import { CommentService } from './comment.service';

@UseInterceptors(new TransformInterceptor())
@UseFilters(new CustomRpcExceptionFilter())
@Controller()
@CommentServiceControllerMethods()
export class CommentController implements CommentServiceController {
  constructor(private readonly commentService: CommentService) {}

  async getCommentList(request: GetCommentListRequest) {
    const commentList = await this.commentService.getCommentList(
      request.questionId,
    );

    return {
      data: commentList,
      meta: {
        next_page_token: null,
        total: 0,
      },
    };
  }

  async getQuestionListWithLatestComment(
    request: GetQuestionListWithLatestCommentRequest,
  ) {
    const questionList =
      await this.commentService.getQuestionListWithLatestComment(
        request.examinationId,
      );

    return {
      data: questionList,
      meta: {
        next_page_token: 'TEST',
        total: 0,
      },
    };
  }

  createComment(request: CreateCommentRequest) {
    return this.commentService.createComment(
      request.questionId,
      request.userId,
      request.data,
    );
  }
}
