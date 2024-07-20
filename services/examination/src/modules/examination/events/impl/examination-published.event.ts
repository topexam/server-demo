import { IEvent } from "@nestjs/cqrs";

export class ExaminationPublishedEvent implements IEvent {
    constructor(
        public readonly examinationId: string
    ) { }
}