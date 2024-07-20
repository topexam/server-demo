import { IQuery } from "@nestjs/cqrs";

export class GetSubCategoryItemQuery implements IQuery {
  constructor(
    public readonly subCategoryId: string,
  ) { }
}