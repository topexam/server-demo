import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthZModule } from '@topthithu/nest-authz';
import { checkCurrentEnv, EEnvironmentMode } from '@topexam/api.lib.common';

import { EnvConfiguration, EnvValidationSchema } from '@/config';
import { CheckBasicAuthMiddleware, AUTH_MODULE_PREFIX } from '@/modules/auth';
import { BaseModule } from '@/modules/base';
import { SubmissionModule } from '@/modules/submission';
import { ExaminationModule } from '@/modules/examination';
import { ApiQueryParamsMiddleware } from './middlewares';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: EnvValidationSchema,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    AuthZModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configSrv: ConfigService) => {
        return {
          issuer: configSrv.get('SERVICE.AUTH0_ISSUER'),
          audience: configSrv.get('SERVICE.AUTH0_AUDIENCE'),
          namespace: configSrv.get('SERVICE.AUTH0_NAMESPACE'),
        };
      },
      inject: [ConfigService],
    }),
    RavenModule,
    BaseModule,
    SubmissionModule,
    ExaminationModule,
  ],
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CheckBasicAuthMiddleware).forRoutes(AUTH_MODULE_PREFIX);
    consumer.apply(ApiQueryParamsMiddleware).forRoutes('*');
  }
}
