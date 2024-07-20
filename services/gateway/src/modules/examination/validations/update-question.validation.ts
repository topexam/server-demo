import * as Joi from 'joi';
import { EQuestionType } from '../enums/question-type.enum';
import { OptionSchema, AnswerSchema } from './common-schema.validation';

export const UpdateQuestionSchemaValidation = Joi.object({
  title: Joi.string().trim(),
  question_type: Joi.string().valid(...Object.values(EQuestionType)),
  options: Joi.array().items(OptionSchema),
  answers: AnswerSchema,
  question_group_id: Joi.string(),
  next: Joi.string().allow(null),
  prev: Joi.string().allow(null),
});
