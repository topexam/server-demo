export class CreateQuestionDTO {
  title?: string;
  options?: { title: string; content: string }[];
  answers?: { options: string[]; explain?: string };
  question_group_id: string;
  prev?: string | null;
  next?: string | null;
}

export class CreateQuestionWithExaminationDTO extends CreateQuestionDTO {
  examination_id?: string;
}
