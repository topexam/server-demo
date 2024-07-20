import { ApiProperty } from "@nestjs/swagger";

export class CreateSubCategoryDTO {
    @ApiProperty()
    name: string;
    @ApiProperty()
    slug: string;
    @ApiProperty({ required: false })
    note?: string;
    @ApiProperty()
    category_id: string;
}