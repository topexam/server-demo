import { ApiProperty } from '@nestjs/swagger';

import { EExaminationMode, EExaminationStatus } from '../enums';

export class UpdateExaminationDTO {
  @ApiProperty({ required: false })
  title?: string;
  @ApiProperty({ required: false })
  time?: number;
  @ApiProperty({ required: false })
  sub_category_id?: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ required: false })
  price?: number;
  @ApiProperty({ required: false })
  tag_ids?: string[];
  @ApiProperty({ required: false })
  author_id?: string;
  @ApiProperty({ required: false })
  status?: EExaminationStatus;
  @ApiProperty({ required: false })
  mode?: EExaminationMode;
  @ApiProperty({ required: false })
  thumbnail: string;
  @ApiProperty({ required: false })
  file: string;
}
