import { CreateQuestionHandler } from './create-question.handler';
import { CreateQuestionGroupHandler } from './create-question-group.handler';
import { RemoveQuestionHandler } from './remove-question.handler';
import { RemoveQuestionGroupHandler } from './remove-question-group.handler';
import { UpdateQuestionHandler } from './update-question.handler';
import { UpdateQuestionGroupHandler } from './update-question-group.handler';
import { CreateBulkQuestionHandler } from './create-bulk-question.handler';

export const QuestionCommandHandlers = [
  CreateQuestionHandler,
  CreateBulkQuestionHandler,
  UpdateQuestionHandler,
  RemoveQuestionHandler,
];
export const QuestionGroupCommandHandlers = [
  CreateQuestionGroupHandler,
  UpdateQuestionGroupHandler,
  RemoveQuestionGroupHandler,
];
