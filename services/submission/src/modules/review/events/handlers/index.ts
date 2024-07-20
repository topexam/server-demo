import { ReviewCreatedHandler } from "./review-created.handler";
import { ReviewUpdatedHandler } from "./review-updated.handler";

export const ReviewEventHandlers = [
    ReviewCreatedHandler,
    ReviewUpdatedHandler
];