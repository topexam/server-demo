import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SASLOptions } from 'kafkajs';

import { AppModule } from '@/app.module';
import { EXAMINATION_SERVICE_PACKAGE, SERVICE_PREFIX } from '@/constants';
import { setupSentryConfig } from '@/bootstrap';
import { CHALLENGE_PACKAGE_NAME } from './modules/challenge';
import {
  QUESTION_GROUP_PACKAGE_NAME,
  QUESTION_PACKAGE_NAME,
} from './modules/question';
import { EXAMINATION_PACKAGE_NAME } from './modules/examination';
import { COMMENT_PACKAGE_NAME } from './modules/comment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configSrv = app.get(ConfigService);
  const port = configSrv.get<string>('APP.PORT');

  setupSentryConfig(app);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configSrv.get<string>('DB.KAFKA_CLIENT_ID'),
        brokers: configSrv.get<string[]>('DB.KAFKA_BROKERS'),
        ssl: configSrv.get<boolean>('DB.KAFKA_SSL'),
        sasl: configSrv.get<SASLOptions>('DB.KAFKA_SASL_CONF'),
      },
      consumer: {
        groupId: configSrv.get<string>('DB.KAFKA_GROUP_ID'),
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: [EXAMINATION_SERVICE_PACKAGE],
      protoPath: [
        `node_modules/@topexam/api.service.proto/dist/proto/${EXAMINATION_PACKAGE_NAME}.proto`,
        `node_modules/@topexam/api.service.proto/dist/proto/${QUESTION_GROUP_PACKAGE_NAME}.proto`,
        `node_modules/@topexam/api.service.proto/dist/proto/${QUESTION_PACKAGE_NAME}.proto`,
        `node_modules/@topexam/api.service.proto/dist/proto/${CHALLENGE_PACKAGE_NAME}.proto`,
        `node_modules/@topexam/api.service.proto/dist/proto/${COMMENT_PACKAGE_NAME}.proto`,
      ],
      url: `0.0.0.0:${port}`,
      loader: {
        keepCase: true,
        arrays: true,
        objects: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`API is running...`, SERVICE_PREFIX);
}

bootstrap();
