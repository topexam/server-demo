import { EQuestionType } from '../enums';

export class UpdateQuestionDTO {
  title?: string;
  question_type?: EQuestionType;
  options?: { title: string; content: string }[];
  answers?: { options: string[]; explain?: string };
  question_group_id?: string;
  prev?: string;
  next?: string;
}
