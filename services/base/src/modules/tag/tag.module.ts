import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SASLOptions } from 'kafkajs';

import { TagCommandHandlers } from './commands';
import { TagEventHandlers } from './events';
import { TagQueryHandlers } from './queries';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TagRepository } from './repositories';
import { TagModel, TagSchema } from './schemas';
import { TAG_KAFKA_CLIENT_NAME } from './constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TagModel.name,
        schema: TagSchema,
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: TAG_KAFKA_CLIENT_NAME,
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
  ],
  controllers: [TagController],
  providers: [
    TagService,
    TagRepository,
    ...TagCommandHandlers,
    ...TagQueryHandlers,
    ...TagEventHandlers,
  ],
})
export class TagModule {}
