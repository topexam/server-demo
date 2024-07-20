import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import {
  BASE_MODULE_SERVICE,
  BASE_PACKAGE_SERVICE,
  CATEGORY_PACKAGE_NAME,
  SUB_CATEGORY_PACKAGE_NAME,
  TAG_PACKAGE_NAME,
  FILE_PACKAGE_NAME,
} from './constant';
import {
  CategoryController,
  FileController,
  SubCategoryController,
  TagController,
} from './controllers';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: BASE_MODULE_SERVICE,
        useFactory: (configSrv: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: [BASE_PACKAGE_SERVICE],
            protoPath: [
              `${CATEGORY_PACKAGE_NAME}.proto`,
              `${SUB_CATEGORY_PACKAGE_NAME}.proto`,
              `${TAG_PACKAGE_NAME}.proto`,
              `${FILE_PACKAGE_NAME}.proto`,
            ],
            url: configSrv.get<string>('APP.GRPC_BASE_URL'),
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
    CategoryController,
    SubCategoryController,
    TagController,
    FileController,
  ],
})
export class BaseModule {}
