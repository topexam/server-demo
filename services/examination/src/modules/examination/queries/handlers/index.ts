import { GetExaminationItemHandler } from './get-examination-item.handler';
import { GetExaminationListRecommendedHandler } from './get-examination-list-recommended.handler';
import { GetExaminationListRelatedHandler } from './get-examination-list-related.handler';
import { GetExaminationListHandler } from './get-examination-list.handler';

export const ExaminationQueryHandlers = [
  GetExaminationListHandler,
  GetExaminationListRecommendedHandler,
  GetExaminationListRelatedHandler,
  GetExaminationItemHandler,
];
