import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  slug: string;
  @ApiProperty({ required: false })
  note?: string;
}
