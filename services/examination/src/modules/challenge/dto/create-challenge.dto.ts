export class CreateChallengeDTO {
  open_time: string;
  close_time: string;
  title: string;
  time: number;
  sub_category_id: string;
  description: string;
  price: number;
  tags?: string[];
  thumbnail: string;
}

export class CreateChallengeDTOWithAuthor extends CreateChallengeDTO {
  author_id: string;
}
