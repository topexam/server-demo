import { IQuery } from "@nestjs/cqrs";

export class GetUserItemQuery implements IQuery {
  constructor(
    public readonly userId: string,
  ) { }
}