import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { DataListenerModule } from '@/modules/data-listener';

import { ReviewCommandHandlers } from './commands';
import { ReviewEventHandlers } from './events';
import { ReviewQueryHandlers } from './queries';
import { ReviewRepository } from './repositories';
import { ReviewModel, ReviewSchema } from './schemas';

import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { REVIEW_KAFKA_CLIENT_NAME } from './constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReviewModel.name, schema: ReviewSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: REVIEW_KAFKA_CLIENT_NAME,
        useFactory: (configSrv: ConfigService) => ({
          options: {
            client: {
              clientId: configSrv.get<string>('DB.KAFKA_CLIENT_ID'),
              brokers: configSrv.get<string[]>('DB.KAFKA_BROKERS'),
              ssl: configSrv.get<boolean>('DB.KAFKA_SSL'),
              sasl: configSrv.get<boolean>('DB.KAFKA_SASL')
                ? {
                    mechanism: configSrv.get<string>(
                      'DB.KAFKA_MECHANISM',
                    ) as any,
                    username: configSrv.get<string>('DB.KAFKA_USERNAME'),
                    password: configSrv.get<string>('DB.KAFKA_PASSWORD'),
                  }
                : null,
            },
            consumer: {
              groupId: configSrv.get<string>('DB.KAFKA_GROUP_ID'),
              allowAutoTopicCreation: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    CqrsModule,
    DataListenerModule,
  ],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    ReviewRepository,
    ...ReviewCommandHandlers,
    ...ReviewQueryHandlers,
    ...ReviewEventHandlers,
  ],
})
export class ReviewModule {}
