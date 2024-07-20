import { IEvent } from "@nestjs/cqrs";

export class TagCreatedEvent implements IEvent {
  constructor(
    public readonly tagId: string) {}
}