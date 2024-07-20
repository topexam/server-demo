import { ICommand } from "@nestjs/cqrs";

export class PublishExaminationCommand implements ICommand {
  constructor(
    public readonly examinationId: string,
  ) { }
}