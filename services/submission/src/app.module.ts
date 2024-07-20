import { HttpException, Module } from '@nestjs/common';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { checkCurrentEnv, EEnvironmentMode } from '@topexam/api.lib.common';

import { EnvConfiguration, EnvValidationSchema } from '@/configs';
import { DataListenerModule } from '@/modules/data-listener';
import { DBModule } from '@/modules/db';
import { SubmissionModule } from '@/modules/submission';
import { ExaminationRankingModule } from '@/modules/ranking';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: EnvValidationSchema,
    }),
    RavenModule,
    DBModule,
    SubmissionModule,
    ExaminationRankingModule,
    DataListenerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (configSrv: ConfigService) => {
        return (
          checkCurrentEnv(EEnvironmentMode.PRODUCTION) &&
          new RavenInterceptor({
            filters: [
              {
                type: HttpException,
                filter: (exception: HttpException) =>
                  500 > exception.getStatus(),
              },
            ],
            tags: {
              'service.name': configSrv.get<string>('APP.NAME'),
              'service.version': configSrv.get<string>('APP.VERSION'),
              'service.revision': configSrv.get<string>('APP.REVISION'),
            },
          })
        );
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
