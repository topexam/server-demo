import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SASLOptions } from 'kafkajs';

import { DataListenerModule } from '@/modules/data-listener';
import { QuestionModule } from '@/modules/question';
import { ExaminationModule } from '@/modules/examination';

import { CommentCommandHandlers } from './commands';
import { CommentQueryHandlers } from './queries';
import { CommentRepository } from './repositories';
import { CommentModel, CommentSchema } from './schemas';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { COMMENT_KAFKA_CLIENT_NAME } from './constant';
import { CommentEventHandlers } from './events';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentModel.name, schema: CommentSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: COMMENT_KAFKA_CLIENT_NAME,
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
    DataListenerModule,
    QuestionModule,
    ExaminationModule,
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentRepository,
    ...CommentCommandHandlers,
    ...CommentQueryHandlers,
    ...CommentEventHandlers,
  ],
})
export class CommentModule {}
