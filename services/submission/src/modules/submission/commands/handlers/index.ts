import { CreateSubmissionHandler } from './create-submission.handler';
import { RequestViewAnswerHandler } from './request-view-answer.handler';
import { SubmitSubmissionHandler } from './submit-submission.handler';

export const SubmissionCommandHandlers = [
  CreateSubmissionHandler,
  SubmitSubmissionHandler,
  RequestViewAnswerHandler,
];
