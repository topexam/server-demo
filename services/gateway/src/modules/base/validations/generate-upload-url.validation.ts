import * as Joi from 'joi';

export const GenerateUploadUrlSchemaValidation = Joi.object({
  name: Joi.string().trim().required(),
  size: Joi.number().min(1).required(),
  type: Joi.string().trim().required(),
  resource: Joi.string().trim().required(),
});
