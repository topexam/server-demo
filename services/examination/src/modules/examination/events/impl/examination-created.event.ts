import { IEvent } from "@nestjs/cqrs";

export class ExaminationCreatedEvent implements IEvent {
  constructor(
    public readonly examinationId: string) {}
}