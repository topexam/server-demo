import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDTO {
    @ApiProperty()
    name: string;
    @ApiProperty()
    slug: string;
    @ApiProperty({ required: false })
    note?: string;
}