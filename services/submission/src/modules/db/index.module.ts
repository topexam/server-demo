/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventStoreModule } from '@topthithu/nest-eventstore';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configSrv: ConfigService) => {
        return {
          uri: configSrv.get<string>('DB.MONGO_URI'),
          dbName: configSrv.get<string>('DB.MONGO_DB_NAME'),
          connectionFactory: (connection) => {
            connection.plugin(require('mongoose-delete'), {
              indexFields: 'all',
              overrideMethods: 'all',
            });
            connection.plugin(require('mongoose-autopopulate'));
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    EventStoreModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configSrv: ConfigService) => ({
        endpoint: configSrv.get<string>('DB.EVENT_STORE_ENDPOINT'),
        userCredentials: {
          username: configSrv.get<string>('DB.EVENT_STORE_USERNAME'),
          password: configSrv.get<string>('DB.EVENT_STORE_PASSWORD'),
        },
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
})
export class DBModule {}
