import * as Joi from 'joi';

export const EnvValidationSchema = Joi.object({
  PORT: Joi.string().required(),
  VERSION: Joi.string().required(),
  SENTRY_DSN: Joi.string().required(),
  MONGO_URI: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().required(),
  EVENT_STORE_ENDPOINT: Joi.string().required(),
  EVENT_STORE_CREDENTIALS_USERNAME: Joi.string().required(),
  EVENT_STORE_CREDENTIALS_PASSWORD: Joi.string().required(),
  KAFKA_BROKER: Joi.string().required(),
  KAFKA_CLIENT_ID: Joi.string().required(),
  KAFKA_GROUP_ID: Joi.string().required(),
  KAFKA_SSL: Joi.string().required(),
  KAFKA_SASL: Joi.string().required(),
  KAFKA_MECHANISM: Joi.string().required(),
  KAFKA_USERNAME: Joi.string().allow(''),
  KAFKA_PASSWORD: Joi.string().allow(''),
});
