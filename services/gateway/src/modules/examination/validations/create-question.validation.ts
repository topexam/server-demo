import * as Joi from 'joi';
import { OptionSchema, AnswerSchema } from './common-schema.validation';

export const CreateQuestionSchemaValidation = Joi.object({
  title: Joi.string().trim().allow(null, ''),
  options: Joi.array().items(OptionSchema),
  answers: AnswerSchema,
  next: Joi.string().allow(null),
  prev: Joi.string().allow(null),
  question_group_id: Joi.string(),
});
