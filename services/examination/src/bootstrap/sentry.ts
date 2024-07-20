import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Sentry from "@sentry/node";

export const setupSentryConfig = (app: INestApplication): void => {
    const configSrv = app.get(ConfigService);
    const sentryDsn = configSrv.get<string>('APP.SENTRY_DSN');

    Sentry.init({
        dsn: sentryDsn,
        tracesSampleRate: 1.0,
    });
}