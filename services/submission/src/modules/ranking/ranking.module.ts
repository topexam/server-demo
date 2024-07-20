import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { SubmissionModule } from '@/modules/submission';
import { DataListenerModule } from '@/modules/data-listener';

import { ExaminationRankingQueryHandlers } from './queries';
import { ExaminationRankingRepository } from './repositories';
import { ExaminationRankingController } from './ranking.controller';
import { ExaminationRankingService } from './ranking.service';

@Module({
  imports: [SubmissionModule, DataListenerModule, CqrsModule],
  controllers: [ExaminationRankingController],
  providers: [
    ExaminationRankingService,
    ExaminationRankingRepository,
    ...ExaminationRankingQueryHandlers,
  ],
})
export class ExaminationRankingModule {}
