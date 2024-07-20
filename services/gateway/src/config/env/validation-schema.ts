import * as Joi from 'joi';

export const EnvValidationSchema = Joi.object({
  PORT: Joi.string().required(),
  VERSION: Joi.string().required(),
  BASIC_AUTH_TOKEN: Joi.string().required(),
  SENTRY_DSN: Joi.string().required(),
  AUTH0_ISSUER: Joi.string().required(),
  AUTH0_AUDIENCE: Joi.string().required(),
  AUTH0_NAMESPACE: Joi.string().required(),
  GRPC_BASE_URL: Joi.string().required(),
  GRPC_SUBMISSION_URL: Joi.string().required(),
  GRPC_EXAMINATION_URL: Joi.string().required(),
});
