import { EExaminationMode, EExaminationStatus } from '../enums';

export class UpdateExaminationDTO {
  title?: string;
  time?: number;
  sub_category_id?: string;
  description?: string;
  price?: number;
  tag_ids?: string[];
  author_id?: string;
  status?: EExaminationStatus;
  mode?: EExaminationMode;
  thumbnail?: string;
  file?: string;
}
