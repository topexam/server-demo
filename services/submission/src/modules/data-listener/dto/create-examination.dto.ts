export interface CreateExaminationDTO {
  id: string;
  version: number;
  time: number;
  question_count: number;
  answers: { options: string[]; explain?: string; question: string }[];
}
