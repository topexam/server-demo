import { ILeanQuestionDocument } from '@/modules/question';
import { ILeanCommentDocument } from '../schemas';

export type IQuestionWithLatestComment = ILeanQuestionDocument & {
  comment: ILeanCommentDocument;
  comment_count: number;
};
