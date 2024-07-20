import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { checkCurrentEnv, EEnvironmentMode } from '@topexam/api.lib.common';

import { ExpirationModule } from '@/modules/expiration';
import { DBModule } from '@/modules/db';
import { EnvConfiguration, EnvValidationSchema } from '@/configs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: EnvValidationSchema,
    }),
    DBModule,
    RavenModule,
    ExpirationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (configSrv: ConfigService) => {
        return (
          checkCurrentEnv(EEnvironmentMode.PRODUCTION) &&
          new RavenInterceptor({
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
