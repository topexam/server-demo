import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable, delay, map } from 'rxjs';

import { CreateExaminationCommand } from '@/modules/examination';

import { ChallengeCreatedEvent } from '../events';

@Injectable()
export class ChallengeSagas {
  @Saga()
  userCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ChallengeCreatedEvent),
      delay(1000),
      map((event) => {
        Logger.log('Inside [ChallengeSagas] Saga', 'ChallengeSagas');
        return new CreateExaminationCommand({
          ...event.createChallengeDTO,
          author_id: event.userId,
        });
      }),
    );
  };
}
