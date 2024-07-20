import { getENV } from '@topexam/api.lib.common';

export const EnvConfiguration = (): Record<
  string,
  | string
  | number
  | Record<
      string,
      string | number | boolean | string[] | Record<string, string>
    >
> => ({
  DB: {
    MONGO_URI: getENV('MONGO_URI'),
    MONGO_DB_NAME: getENV('MONGO_DB_NAME'),
    EVENT_STORE_ENDPOINT: getENV('EVENT_STORE_ENDPOINT'),
    EVENT_STORE_CREDENTIALS_USERNAME: getENV(
      'EVENT_STORE_CREDENTIALS_USERNAME',
    ),
    EVENT_STORE_CREDENTIALS_PASSWORD: getENV(
      'EVENT_STORE_CREDENTIALS_PASSWORD',
    ),
    KAFKA_BROKERS: [getENV('KAFKA_BROKER')],
    KAFKA_CLIENT_ID: getENV('KAFKA_CLIENT_ID'),
    KAFKA_GROUP_ID: getENV('KAFKA_GROUP_ID'),
    KAFKA_SSL: getENV('KAFKA_SSL') === 'true',
    KAFKA_SASL: getENV('KAFKA_SASL') === 'true',
    KAFKA_MECHANISM: getENV('KAFKA_MECHANISM'),
    KAFKA_USERNAME: getENV('KAFKA_USERNAME'),
    KAFKA_PASSWORD: getENV('KAFKA_PASSWORD'),
    KAFKA_SASL_CONF:
      getENV('KAFKA_SASL') === 'true'
        ? {
            mechanism: getENV('KAFKA_MECHANISM') as any,
            username: getENV('KAFKA_USERNAME'),
            password: getENV('KAFKA_PASSWORD'),
          }
        : null,
  },
  APP: {
    PORT: +getENV('PORT'),
    VERSION: `v${getENV('VERSION')}`,
    NAME: getENV('npm_package_name'),
    REVISION: getENV('npm_package_version'),
    SENTRY_DSN: getENV('SENTRY_DSN'),
  },
});
