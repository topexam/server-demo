import { TakingExaminationStartedHandler } from './taking-examination-started.handler';
import { TakingExaminationSubmittedHandler } from './taking-examination-submitted.handler';

export const SubmissionEventHandlers = [
  TakingExaminationStartedHandler,
  TakingExaminationSubmittedHandler,
];
