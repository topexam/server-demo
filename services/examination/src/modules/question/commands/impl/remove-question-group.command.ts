import { ICommand } from "@nestjs/cqrs";

export class RemoveQuestionGroupCommand implements ICommand {
  constructor(
    public readonly questionGroupId: string,
  ) { }
}