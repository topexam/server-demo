import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

export const setupSentryConfig = (app: INestApplication): void => {
  const configSrv = app.get(ConfigService);
  const sentryDsn = configSrv.get<string>('APP.SENTRY_DSN');
  const serviceName = configSrv.get<string>('APP.NAME');
  const serviceVersion = configSrv.get<string>('APP.VERSION');

  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 1.0,
    release: `[${serviceName}] ${serviceVersion}`,
  });
};
