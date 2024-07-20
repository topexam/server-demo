import { Module } from '@nestjs/common';
import { RavenModule } from 'nest-raven';
import { ConfigModule } from '@nestjs/config';

import { EnvConfiguration, EnvValidationSchema } from '@/configs';

import { DBModule } from '@/modules/db';
import { DataListenerModule } from '@/modules/data-listener';
import { ExaminationModule } from '@/modules/examination';
import { QuestionModule } from '@/modules/question';
import { ChallengeModule } from '@/modules/challenge';
import { CommentModule } from '@/modules/comment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: EnvValidationSchema,
    }),
    RavenModule,
    DBModule,
    DataListenerModule,
    ExaminationModule,
    QuestionModule,
    ChallengeModule,
    CommentModule,
  ],
})
export class AppModule {}
