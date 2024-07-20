import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SASLOptions } from 'kafkajs';

import { AppModule } from '@/app.module';
import { setupSentryConfig } from '@/bootstrap';
import { BASE_SERVICE_PACKAGE, SERVICE_PREFIX } from '@/constants';
import { CATEGORY_MODULE_PACKAGE } from '@/modules/category';
import { FILE_MODULE_PACKAGE } from '@/modules/file';
import { SUB_CATEGORY_MODULE_PACKAGE } from '@/modules/sub-category';
import { TAG_MODULE_PACKAGE } from '@/modules/tag';

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
      package: [BASE_SERVICE_PACKAGE],
      protoPath: [
        `${CATEGORY_MODULE_PACKAGE}.proto`,
        `${SUB_CATEGORY_MODULE_PACKAGE}.proto`,
        `${TAG_MODULE_PACKAGE}.proto`,
        `${FILE_MODULE_PACKAGE}.proto`,
      ],
      url: `0.0.0.0:${port}`,
      loader: {
        keepCase: true,
        arrays: true,
        objects: true,
        json: true,
        enums: String,
        includeDirs: ['node_modules/@topexam/api.service.proto/dist/proto'],
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`API is running...`, SERVICE_PREFIX);
}

bootstrap();
