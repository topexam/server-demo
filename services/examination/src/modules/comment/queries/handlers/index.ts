import { GetCommentListHandler } from './get-comment-list.handler';
import { GetQuestionListWithLatestCommentHandler } from './get-question-list-with-latest-comment.handler';

export const CommentQueryHandlers = [
  GetCommentListHandler,
  GetQuestionListWithLatestCommentHandler,
];
