import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SASLOptions } from 'kafkajs';

import { SERVICE_PREFIX } from '@/constants';
import { AppModule } from '@/app.module';
import { setupSentryConfig } from '@/bootstrap';

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
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`API is running...`, SERVICE_PREFIX);
}

bootstrap();
