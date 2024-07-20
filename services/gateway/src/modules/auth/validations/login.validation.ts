import * as Joi from 'joi';

export const LoginValidationSchema = Joi.object({
  userNameOrEmail: Joi.string()
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
});
