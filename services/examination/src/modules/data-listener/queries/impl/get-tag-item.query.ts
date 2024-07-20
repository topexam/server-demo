import { IQuery } from "@nestjs/cqrs";

export class GetTagItemQuery implements IQuery {
  constructor(
    public readonly tagId: string,
  ) { }
}