import * as Joi from 'joi';

export const CreateExaminationSchemaValidation = Joi.object({
  title: Joi.string().required(),
  time: Joi.number().min(1).required(),
  sub_category_id: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  price: Joi.number().min(0).required(),
  tag_ids: Joi.array().items(Joi.string()),
  thumbnail: Joi.string().allow(null, ''),
});
