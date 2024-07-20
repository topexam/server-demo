import { ICommand } from "@nestjs/cqrs";

export class RequestViewAnswerCommand implements ICommand {
  constructor(
    public readonly examinationId: string,
    public readonly playerId: string,
  ) { }
}