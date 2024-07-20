/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestMinioModule } from 'nestjs-minio';
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
    NestMinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configSrv: ConfigService) => {
        return {
          endPoint: configSrv.get<string>('DB.MINIO_HOST'),
          port: configSrv.get<number>('DB.MINIO_PORT'),
          useSSL: configSrv.get<boolean>('DB.MINIO_SSL'),
          accessKey: configSrv.get<string>('DB.MINIO_ACCESS_KEY'),
          secretKey: configSrv.get<string>('DB.MINIO_SECRET_KEY'),
        };
      },
      inject: [ConfigService],
    }),
    EventStoreModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configSrv: ConfigService) => ({
        endpoint: configSrv.get<string>('DB.EVENT_STORE_ENDPOINT'),
        insecure: true,
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
