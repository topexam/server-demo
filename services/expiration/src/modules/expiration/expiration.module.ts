import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SASLOptions } from 'kafkajs';

import { ExpirationListener } from './expiration.listener';
import { ExpirationService } from './expiration.service';
import { ExaminationProcessor } from './expiration.processor';
import {
  EXAMINATION_QUEUE_NAME,
  EXPIRATION_KAFKA_CLIENT_NAME,
} from './constant';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: EXAMINATION_QUEUE_NAME,
    }),
    ClientsModule.registerAsync([
      {
        name: EXPIRATION_KAFKA_CLIENT_NAME,
        useFactory: (configSrv: ConfigService) => ({
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
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [ExpirationListener, ExpirationService, ExaminationProcessor],
})
export class ExpirationModule {}
