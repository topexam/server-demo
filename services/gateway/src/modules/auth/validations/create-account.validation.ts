import * as Joi from 'joi';

export const CreateAccountValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(4).max(20).required(),
  auth0_id: Joi.string().required(),
});
