import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SASLOptions } from 'kafkajs';

import {
  QuestionModule,
  QuestionGroupService,
  IQuestionGroupDocument,
} from '@/modules/question';

import { ExaminationCommandHandlers } from './commands';
import { ExaminationEventHandlers } from './events';
import { ExaminationQueryHandlers } from './queries';
import { ExaminationRepository } from './repositories';
import { ExaminationModel, ExaminationSchema } from './schemas';
import { EXAMINATION_KAFKA_CLIENT_NAME } from './constant';
import ExaminationController from './examination.controller';
import { ExaminationService } from './examination.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        imports: [QuestionModule],
        name: ExaminationModel.name,
        useFactory: (questionGroupSrv: QuestionGroupService): any => {
          const schema = ExaminationSchema;
          schema.pre<IQuestionGroupDocument>('save', async function () {
            if (this.isNew) {
              await questionGroupSrv.createQuestionGroup(this._id, {
                content: 'Default group',
                is_default: true,
              });
            }
          });
          return schema;
        },
        inject: [QuestionGroupService],
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: EXAMINATION_KAFKA_CLIENT_NAME,
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
    forwardRef(() => QuestionModule),
  ],
  controllers: [ExaminationController],
  providers: [
    ExaminationService,
    ExaminationRepository,
    ...ExaminationCommandHandlers,
    ...ExaminationQueryHandlers,
    ...ExaminationEventHandlers,
  ],
  exports: [ExaminationService, ...ExaminationCommandHandlers],
})
export class ExaminationModule {}
