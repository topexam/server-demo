import { ApiProperty } from "@nestjs/swagger";

export class SearchQueryDTO {
    @ApiProperty()
    q: string;
}