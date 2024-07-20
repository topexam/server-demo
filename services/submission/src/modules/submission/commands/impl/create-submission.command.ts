import { ICommand } from '@nestjs/cqrs';

export class CreateSubmissionCommand implements ICommand {
  constructor(
    public readonly examinationId: string,
    public readonly playerId: string,
  ) {}
}
