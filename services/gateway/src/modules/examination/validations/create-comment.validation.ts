import * as Joi from 'joi';

export const CreateCommentSchemaValidation = Joi.object({
    content: Joi.string()
        .trim()
        .required(),
    examination: Joi.string()
        .required(),
});
