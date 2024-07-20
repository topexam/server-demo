import { GetQuestionItemHandler } from './get-question-item.handler';
import { GetQuestionListHandler } from './get-question-list.handler';
import { GetQuestionGroupItemHandler } from './get-question-group-item.handler';
import { GetQuestionGroupListHandler } from './get-question-group.handler';
import { GetDefaultQuestionGroupHandler } from './get-default-question-group.handler';
import { GetFileQuestionListHandler } from './get-file-question-list.handler';

export const QuestionQueryHandlers = [
  GetQuestionListHandler,
  GetQuestionItemHandler,
  GetFileQuestionListHandler,
];
export const QuestionGroupQueryHandlers = [
  GetQuestionGroupListHandler,
  GetQuestionGroupItemHandler,
  GetDefaultQuestionGroupHandler,
];
