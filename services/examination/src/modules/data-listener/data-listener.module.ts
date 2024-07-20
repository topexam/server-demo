import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SASLOptions } from 'kafkajs';

import { DataListenerCommandHandlers } from './commands';
import {
  UserRepository,
  SubCategoryRepository,
  TagRepository,
} from './repositories';
import {
  SubCategoryModel,
  SubCategorySchema,
  UserModel,
  UserSchema,
  TagModel,
  TagSchema,
} from './schemas';
import { DataListenerListener } from './data-listener.listener';
import { DataListenerService } from './data-listener.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
      { name: SubCategoryModel.name, schema: SubCategorySchema },
      { name: TagModel.name, schema: TagSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'DATA_LISTENER_SERVICE',
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
  controllers: [DataListenerListener],
  providers: [
    DataListenerService,
    UserRepository,
    SubCategoryRepository,
    TagRepository,
    ...DataListenerCommandHandlers,
  ],
  exports: [DataListenerService],
})
export class DataListenerModule {}
