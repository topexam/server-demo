import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import {
  setupSecurityConfig,
  setupSwaggerConfig,
  setupSentryConfig,
} from './bootstrap';
import { SERVICE_PREFIX } from './constant';
import { AllExceptionsFilter } from './exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      // forbidNonWhitelisted: true,
      // transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true,
      // },
    }),
  );

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  const configSrv = app.get(ConfigService);
  const port = configSrv.get<number>('APP.PORT');
  const version = configSrv.get<string>('APP.VERSION');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [version],
  });
  // app.setGlobalPrefix(`v${version}`);
  setupSecurityConfig(app);
  setupSwaggerConfig(app);
  setupSentryConfig(app);

  await app.listen(port);
  Logger.log(`API is running.. ${port}`, `${SERVICE_PREFIX}.${version}`);
}

bootstrap();
