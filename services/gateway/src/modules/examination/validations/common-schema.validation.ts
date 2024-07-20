import * as Joi from 'joi';

export const OptionSchema = Joi.object({
  title: Joi.string().trim().required(),
  content: Joi.string().trim().required(),
});

export const AnswerSchema = Joi.object({
  options: Joi.array().items(Joi.string()).min(1).required(),
  explain: Joi.string().trim().allow(null, ''),
});
