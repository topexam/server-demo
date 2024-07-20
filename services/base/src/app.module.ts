import { HttpException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { checkCurrentEnv, EEnvironmentMode } from '@topexam/api.lib.common';

import { EnvConfiguration, EnvValidationSchema } from '@/configs';
import { SubCategoryModule } from '@/modules/sub-category';
import { CategoryModule } from '@/modules/category';
import { FileModule } from '@/modules/file';
import { TagModule } from '@/modules/tag';
import { DBModule } from '@/modules/db';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: EnvValidationSchema,
    }),
    RavenModule,
    DBModule,
    CategoryModule,
    SubCategoryModule,
    TagModule,
    FileModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue:
        checkCurrentEnv(EEnvironmentMode.PRODUCTION) &&
        new RavenInterceptor({
          filters: [
            {
              type: HttpException,
              filter: (exception: HttpException) => 500 > exception.getStatus(),
            },
          ],
        }),
    },
  ],
})
export class AppModule {}
