import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SASLOptions } from 'kafkajs';

import { CategoryCommandHandlers } from './commands/handlers';
import { CategoryQueryHandlers } from './queries/handler';
import { CategoryModel, CategorySchema } from './schemas';
import { CategoryRepository } from './repositories';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryEventHandlers } from './events';
import { CATEGORY_KAFKA_CLIENT_NAME } from './constant';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategoryModel.name, schema: CategorySchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: CATEGORY_KAFKA_CLIENT_NAME,
        useFactory: (configSrv: ConfigService) => {
          return {
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
          };
        },
        inject: [ConfigService],
      },
    ]),
    CqrsModule,
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    ...CategoryCommandHandlers,
    ...CategoryQueryHandlers,
    ...CategoryEventHandlers,
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
