import { ISubmissionDocument } from '../schemas/submission.schema';

export interface ISubmissionWithAnswer
  extends Omit<ISubmissionDocument, 'answers'> {
  answers?: { options: string[]; explain?: string; question: string }[];
}
