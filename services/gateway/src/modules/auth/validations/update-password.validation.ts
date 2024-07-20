import * as Joi from 'joi';

export const UpdatePasswordValidationSchema = Joi.object({
    newPassword: Joi.string()
    .min(6)
    .required(),
});
