import * as Joi from 'joi';
import { CreateQuestionSchemaValidation } from './create-question.validation';

export const CreateBulkQuestionSchemaValidation = Joi.object({
  questions: Joi.array().items(CreateQuestionSchemaValidation).min(1),
});
