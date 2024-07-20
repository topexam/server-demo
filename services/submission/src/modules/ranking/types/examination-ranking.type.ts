export type IExaminationRanking = {
  submission_id: string;
  result: number;
  question_count: number;
  start_time: string;
  end_time: string;
  examination_id: string;
  rank?: number;
  taker_id: string;
  taker: any;
};
