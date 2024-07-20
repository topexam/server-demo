import { EExaminationType } from '../enums';

export class CreateExaminationDTO {
  title: string;
  time: number;
  sub_category_id: string;
  description: string;
  price: number;
  tag_ids?: string[];
  thumbnail: string;
  type?: EExaminationType;
}

export class CreateExaminationDTOWithAuthor extends CreateExaminationDTO {
  author_id: string;
}
