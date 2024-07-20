import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SASLOptions } from 'kafkajs';

import { ExaminationModule } from '@/modules/examination';

import {
  QuestionCommandHandlers,
  QuestionGroupCommandHandlers,
} from './commands';
import { QuestionGroupQueryHandlers, QuestionQueryHandlers } from './queries';
import { QuestionRepository, QuestionGroupRepository } from './repositories';
import {
  FileQuestionModel,
  FileQuestionSchema,
  NormalQuestionModel,
  NormalQuestionSchema,
  QuestionGroupModel,
  QuestionGroupSchema,
  QuestionModel,
  QuestionSchema,
} from './schemas';
import { QuestionService, QuestionGroupService } from './services';
import { QuestionController, QuestionGroupController } from './controllers';
import { QuestionEventHandlers } from './events';
import { QUESTION_KAFKA_CLIENT_NAME } from './constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionGroupModel.name, schema: QuestionGroupSchema },
      {
        name: QuestionModel.name,
        schema: QuestionSchema,
        discriminators: [
          { name: NormalQuestionModel.name, schema: NormalQuestionSchema },
          { name: FileQuestionModel.name, schema: FileQuestionSchema },
        ],
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: QUESTION_KAFKA_CLIENT_NAME,
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
    forwardRef(() => ExaminationModule),
  ],
  controllers: [QuestionController, QuestionGroupController],
  providers: [
    QuestionService,
    QuestionRepository,
    ...QuestionQueryHandlers,
    ...QuestionCommandHandlers,
    ...QuestionEventHandlers,
    QuestionGroupService,
    QuestionGroupRepository,
    ...QuestionGroupQueryHandlers,
    ...QuestionGroupCommandHandlers,
  ],
  exports: [QuestionService, QuestionGroupService, QuestionRepository],
})
export class QuestionModule {}
