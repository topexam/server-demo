import { IQuery } from "@nestjs/cqrs";

export class GetExaminationItemQuery implements IQuery{
    constructor(
        readonly examinationId: string
    ) {}
}