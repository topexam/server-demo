import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionListFromFileDTO {
  @ApiProperty()
  file: string;
  @ApiProperty()
  question_count: number;
}
