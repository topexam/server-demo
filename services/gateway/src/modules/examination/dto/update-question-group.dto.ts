import { ApiProperty } from "@nestjs/swagger";

export class UpdateQuestionGroupDTO {
    @ApiProperty()
    content: string;
}