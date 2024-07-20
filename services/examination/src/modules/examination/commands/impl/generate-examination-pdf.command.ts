import { ICommand } from "@nestjs/cqrs";

export class GenerateExaminationPDFCommand implements ICommand {
  constructor(
    public readonly examinationId: string,
  ) { }
}