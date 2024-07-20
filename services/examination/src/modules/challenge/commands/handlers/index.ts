import { CreateChallengeHandler } from './create-challenge.handler';
import { UpdateChallengeHandler } from './update-challenge.handler';
import { DeleteChallengeHandler } from './delete-challenge.handler';

export const ChallengeCommandHandlers = [
  CreateChallengeHandler,
  UpdateChallengeHandler,
  DeleteChallengeHandler,
];
