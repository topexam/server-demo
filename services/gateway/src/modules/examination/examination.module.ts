import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import {
  ExaminationController,
  QuestionGroupController,
  QuestionController,
} from './controllers';
import {
  EXAMINATION_MODULE_SERVICE,
  EXAMINATION_PACKAGE_NAME,
  EXAMINATION_PACKAGE_SERVICE,
  QUESTION_GROUP_PACKAGE_NAME,
  QUESTION_PACKAGE_NAME,
} from './constant';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: EXAMINATION_MODULE_SERVICE,
        useFactory: (configSrv: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: [EXAMINATION_PACKAGE_SERVICE],
            protoPath: [
              `${EXAMINATION_PACKAGE_NAME}.proto`,
              `${QUESTION_GROUP_PACKAGE_NAME}.proto`,
              `${QUESTION_PACKAGE_NAME}.proto`,
            ],
            url: configSrv.get<string>('APP.GRPC_EXAMINATION_URL'),
            loader: {
              keepCase: true,
              arrays: true,
              objects: true,
              json: true,
              enums: String,
              includeDirs: [
                'node_modules/@topexam/api.service.proto/dist/proto',
              ],
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [
    ExaminationController,
    QuestionGroupController,
    QuestionController,
  ],
})
export class ExaminationModule {}
