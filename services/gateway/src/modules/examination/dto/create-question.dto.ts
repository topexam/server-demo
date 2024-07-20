import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDTO {
  @ApiProperty({ required: false })
  title?: string;
  @ApiProperty()
  options?: { title: string; content: string }[];
  @ApiProperty({ required: false })
  answers?: { options: string[]; explain?: string };
  @ApiProperty()
  question_group_id: string;
  @ApiProperty({ required: false })
  prev?: string | null;
  @ApiProperty({ required: false })
  next?: string | null;
}
