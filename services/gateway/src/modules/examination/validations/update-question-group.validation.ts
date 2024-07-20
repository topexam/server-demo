import * as Joi from 'joi';

export const UpdateQuestionGroupSchemaValidation = Joi.object({
  content: Joi.string().trim().required(),
});
