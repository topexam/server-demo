/* eslint-disable @typescript-eslint/no-var-requires */
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configSrv: ConfigService) => {
        return {
          redis: {
            host: configSrv.get<string>('DB.REDIS_HOST'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DBModule {}
