import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import { DataListenerCommandHandlers } from './commands';
import { ExaminationRepository } from './repositories';
import { ExaminationModel, ExaminationSchema } from './schemas';

import { DataListenerListener } from './data-listener.listener';
import { DataListenerService } from './data-listener.service';
import { DataListenerQueryHandlers } from './queries';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ExaminationModel.name,
        schema: ExaminationSchema,
      },
    ]),
    CqrsModule,
  ],
  controllers: [DataListenerListener],
  providers: [
    DataListenerService,
    ExaminationRepository,
    ...DataListenerCommandHandlers,
    ...DataListenerQueryHandlers,
  ],
  exports: [ExaminationRepository, DataListenerService],
})
export class DataListenerModule {}
