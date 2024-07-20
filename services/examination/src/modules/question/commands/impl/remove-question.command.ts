import { ICommand } from "@nestjs/cqrs";

export class RemoveQuestionCommand implements ICommand {
  constructor(
    public readonly questionId: string,
  ) { }
}