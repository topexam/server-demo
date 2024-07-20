import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SASLOptions } from 'kafkajs';

import { FileCommandHandlers } from './commands';
import { FileQueryHandlers } from './queries';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileRepository } from './repositories';
import { FileModel, FileSchema } from './schemas';
import { FileEventHandlers } from './events';
import { FILE_KAFKA_CLIENT_NAME } from './constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FileModel.name,
        schema: FileSchema,
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: FILE_KAFKA_CLIENT_NAME,
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
  controllers: [FileController],
  providers: [
    FileService,
    FileRepository,
    ...FileCommandHandlers,
    ...FileQueryHandlers,
    ...FileEventHandlers,
  ],
})
export class FileModule {}
