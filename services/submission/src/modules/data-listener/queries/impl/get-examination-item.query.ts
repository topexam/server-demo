import { IQuery } from "@nestjs/cqrs";

export class GetExaminationItemQuery implements IQuery {
  constructor(
    public readonly examinationId: string,
  ) { }
}