import * as Joi from 'joi';

export const CreateQuestionGroupSchemaValidation = Joi.object({
  content: Joi.string().trim().required(),
});
