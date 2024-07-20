import { IEvent } from "@nestjs/cqrs";

export class SubCategoryCreatedEvent implements IEvent {
  constructor(
    public readonly subCategoryId: string) {}
}