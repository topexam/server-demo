import { ICommand } from "@nestjs/cqrs";

export class DeleteExaminationCommand implements ICommand {
  constructor(
    public readonly examinationId: string,
  ) { }
}