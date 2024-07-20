import { ICommand } from '@nestjs/cqrs';

import { SubmitSubmissionDTO } from '../../dto';

export class SubmitSubmissionCommand implements ICommand {
  constructor(
    public readonly submissionId: string,
    public readonly submitSubmissionDTO?: SubmitSubmissionDTO,
  ) {}
}
