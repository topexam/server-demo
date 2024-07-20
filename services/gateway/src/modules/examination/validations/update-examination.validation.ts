import * as Joi from 'joi';
import { EExaminationMode, EExaminationStatus } from '../enums';

export const UpdateExaminationSchemaValidation = Joi.object({
  title: Joi.string(),
  time: Joi.number().min(1),
  sub_category_id: Joi.string(),
  description: Joi.string().allow(null, ''),
  price: Joi.number().min(0),
  tag_ids: Joi.array().items(Joi.string()),
  status: Joi.string().valid(...Object.values(EExaminationStatus)),
  mode: Joi.string().valid(...Object.values(EExaminationMode)),
  thumbnail: Joi.string().allow(null, ''),
  file: Joi.string().allow(null, ''),
});
