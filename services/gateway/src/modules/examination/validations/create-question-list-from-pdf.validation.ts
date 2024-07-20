import * as Joi from 'joi';

export const CreateQuestionListFromPDFSchemaValidation = Joi.object({
  file: Joi.string().trim().required(),
  question_num: Joi.number().min(1).required(),
});
