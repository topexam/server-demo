import { getENV } from '@topexam/api.lib.common';

export const EnvConfiguration = (): Record<
  string,
  string | number | Record<string, string | number>
> => ({
  APP: {
    PORT: +getENV('PORT'),
    VERSION: getENV('VERSION'),
    NAME: getENV('npm_package_name'),
    REVISION: getENV('npm_package_version'),
    BASIC_AUTH_TOKEN: getENV('BASIC_AUTH_TOKEN'),
    GRPC_BASE_URL: getENV('GRPC_BASE_URL'),
    GRPC_SUBMISSION_URL: getENV('GRPC_SUBMISSION_URL'),
    GRPC_EXAMINATION_URL: getENV('GRPC_EXAMINATION_URL'),
  },
  SERVICE: {
    SENTRY_DSN: getENV('SENTRY_DSN'),
    AUTH0_ISSUER: getENV('AUTH0_ISSUER'),
    AUTH0_AUDIENCE: getENV('AUTH0_AUDIENCE'),
    AUTH0_NAMESPACE: getENV('AUTH0_NAMESPACE'),
  },
});
