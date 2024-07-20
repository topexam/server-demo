import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { SASLOptions } from 'kafkajs';

import { CategoryService, CategoryModule } from '@/modules/category';
import { ECommandAction } from '@/enums';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import {
  ISubCategoryDocument,
  SubCategoryModel,
  SubCategorySchema,
} from './schemas';
import { SubCategoryCommandHandlers } from './commands';
import { SubCategoryEventHandlers } from './events';
import { SubCategoryQueryHandlers } from './queries';
import { SubCategoryRepository } from './repositories';
import { SUB_CATEGORY_KAFKA_CLIENT_NAME } from './constant';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        imports: [CategoryModule],
        name: SubCategoryModel.name,
        useFactory: (categoryService: CategoryService): any => {
          const schema = SubCategorySchema;
          schema.post<ISubCategoryDocument>(
            'save',
            async (doc: ISubCategoryDocument) => {
              await categoryService.updateSubCategory(doc.category_id, {
                subCategoryId: doc.id,
                action: ECommandAction.ADDED,
              });
            },
          );
          schema.post<ISubCategoryDocument>(
            'remove',
            async (doc: ISubCategoryDocument) => {
              await categoryService.updateSubCategory(doc.category_id, {
                subCategoryId: doc.id,
                action: ECommandAction.REMOVED,
              });
            },
          );
          return schema;
        },
        inject: [CategoryService],
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: SUB_CATEGORY_KAFKA_CLIENT_NAME,
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
    CategoryModule,
  ],
  controllers: [SubCategoryController],
  providers: [
    SubCategoryService,
    SubCategoryRepository,
    ...SubCategoryCommandHandlers,
    ...SubCategoryQueryHandlers,
    ...SubCategoryEventHandlers,
  ],
})
export class SubCategoryModule {}
