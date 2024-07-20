import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import {
  SUBMISSION_MODULE_SERVICE,
  RANKING_PACKAGE_NAME,
  SUBMISSION_PACKAGE_NAME,
  SUBMISSION_PACKAGE_SERVICE,
} from './constant';
import { RankingController, SubmissionController } from './controllers';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SUBMISSION_MODULE_SERVICE,
        useFactory: (configSrv: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: [SUBMISSION_PACKAGE_SERVICE],
            protoPath: [
              `${RANKING_PACKAGE_NAME}.proto`,
              `${SUBMISSION_PACKAGE_NAME}.proto`,
            ],
            url: configSrv.get<string>('APP.GRPC_SUBMISSION_URL'),
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
  controllers: [RankingController, SubmissionController],
})
export class SubmissionModule {}
