import * as Joi from 'joi';

export const CreateSubCategorySchemaValidation = Joi.object({
  name: Joi.string().trim().required(),
  slug: Joi.string().trim().min(2).required(),
  note: Joi.string().allow(null, ''),
  category_id: Joi.string().trim().required(),
});
