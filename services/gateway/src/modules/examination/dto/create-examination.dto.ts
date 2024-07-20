import { ApiProperty } from '@nestjs/swagger';

export class CreateExaminationDTO {
  @ApiProperty()
  title: string;
  @ApiProperty()
  time: number;
  @ApiProperty()
  sub_category_id: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: number;
  @ApiProperty({ required: false })
  tag_ids?: string[];
  @ApiProperty()
  thumbnail: string;
}

export class CreateExaminationDTOWithAuthor extends CreateExaminationDTO {
  author: string;
}
