import { ApiProperty } from '@nestjs/swagger';

import { EQuestionType } from '../enums';

export class UpdateQuestionDTO {
  @ApiProperty({ required: false })
  title?: string;
  @ApiProperty({ required: false })
  question_type?: EQuestionType;
  @ApiProperty({ required: false })
  options?: { title: string; content: string }[];
  @ApiProperty({ required: false })
  answers?: { options: string[]; explain?: string };
  @ApiProperty({ required: false })
  question_group_id?: string;
  @ApiProperty({ required: false })
  prev?: string;
  @ApiProperty({ required: false })
  next?: string;
}
