import * as Joi from 'joi';

export const RegisterValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
});
