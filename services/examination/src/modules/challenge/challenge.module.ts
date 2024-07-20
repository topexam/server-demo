import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { SASLOptions } from 'kafkajs';

import { ExaminationModule } from '@/modules/examination';

import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { CHALLENGE_KAFKA_CLIENT_NAME } from './constant';
import { ChallengeQueryHandlers } from './queries/handlers';
import { ChallengeRepository } from './repositories';
import { ChallengeModel, ChallengeSchema } from './schemas';
import { ChallengeCommandHandlers } from './commands';
import { ChallengeSagas } from './sagas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChallengeModel.name, schema: ChallengeSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: CHALLENGE_KAFKA_CLIENT_NAME,
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
    CqrsModule,
    ExaminationModule,
  ],
  controllers: [ChallengeController],
  providers: [
    ChallengeService,
    ChallengeRepository,
    ...ChallengeQueryHandlers,
    ...ChallengeCommandHandlers,
    ChallengeSagas,
  ],
  exports: [],
})
export class ChallengeModule {}
