import { ApiProperty } from "@nestjs/swagger"

export class CreateQuestionGroupDTO {
    @ApiProperty()
    content: string;
    @ApiProperty({ required: false })
    is_default?: boolean
}