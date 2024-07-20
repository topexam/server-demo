import { ICommand } from "@nestjs/cqrs";

export class UpdateExaminationRatingCommand implements ICommand {
  constructor(
    public readonly examinationId: string,
    public readonly resultRating: number,
  ) { }
}