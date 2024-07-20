import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SASLOptions } from 'kafkajs';

import { DataListenerModule } from '@/modules/data-listener';
import { SubmissionCommandHandlers } from './commands';
import { SubmissionEventHandlers } from './events';
import { SubmissionQueryHandlers } from './queries';
import { SubmissionRepository } from './repositories';
import { SubmissionModel, SubmissionSchema } from './schemas';

import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { SUBMISSION_KAFKA_CLIENT_NAME } from './constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubmissionModel.name, schema: SubmissionSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: SUBMISSION_KAFKA_CLIENT_NAME,
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
    DataListenerModule,
    CqrsModule,
  ],
  controllers: [SubmissionController],
  providers: [
    SubmissionService,
    SubmissionRepository,
    ...SubmissionCommandHandlers,
    ...SubmissionQueryHandlers,
    ...SubmissionEventHandlers,
  ],
  exports: [MongooseModule],
})
export class SubmissionModule {}
