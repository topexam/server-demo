import { ExaminationCreatedHandler } from "./examination-created.handler";
import { ExaminationPublishedHandler } from "./examination-published.handler";

export const ExaminationEventHandlers = [
    ExaminationCreatedHandler,
    ExaminationPublishedHandler
];