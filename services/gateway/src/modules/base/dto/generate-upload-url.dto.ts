import { ApiProperty } from '@nestjs/swagger';

export class GenerateUploadUrlDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  size: number;
  @ApiProperty()
  type: string;
  @ApiProperty()
  resource: string;
}
