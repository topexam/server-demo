import { GetSubmissionItemHandler } from './get-submission-item.handler';
import { GetSubmissionListHandler } from './get-submission-list.handler';

export const SubmissionQueryHandlers = [
  GetSubmissionListHandler,
  GetSubmissionItemHandler,
];
