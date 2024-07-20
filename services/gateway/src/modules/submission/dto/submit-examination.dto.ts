import { ApiProperty } from '@nestjs/swagger';

export class SubmitExaminationDTO {
  @ApiProperty()
  user_answers: { options: string[]; question: string }[];
}
