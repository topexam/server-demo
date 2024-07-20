import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import {
  AUTH_MODULE_SERVICE,
  AUTH_PACKAGE_SERVICE,
  ACCOUNT_PACKAGE_NAME,
} from './constant';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_MODULE_SERVICE,
        useFactory: (configSrv: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: [AUTH_PACKAGE_SERVICE],
            protoPath: [`${ACCOUNT_PACKAGE_NAME}.proto`],
            url: configSrv.get<string>('APP.GRPC_AUTH_URL'),
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
  controllers: [AuthController],
})
export class AuthModule {}
