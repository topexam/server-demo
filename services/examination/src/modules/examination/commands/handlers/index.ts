import { CreateExaminationHandler } from './create-examination.handler';
import { CreateQuestionListFromFileHandler } from './create-question-list-from-pdf.handler';
import { DeleteExaminationHandler } from './delete-examination.handler';
import { GenerateExaminationPDFHandler } from './generate-examination-pdf.handler';
import { UpdateExaminationHandler } from './update-examination.handler';
import { UpdateQuestionNumForExaminationHandler } from './update-question-num-for-examination.handler';
import { PublishExaminationHandler } from './publish-examination.handler';
import { CountExaminationPropertyHandler } from './count-examination-property.handler';
import { UpdateExaminationRatingHandler } from './update-examination-rating.handler';

export const ExaminationCommandHandlers = [
  CreateExaminationHandler,
  UpdateExaminationHandler,
  UpdateQuestionNumForExaminationHandler,
  DeleteExaminationHandler,
  CreateQuestionListFromFileHandler,
  GenerateExaminationPDFHandler,
  PublishExaminationHandler,
  CountExaminationPropertyHandler,
  UpdateExaminationRatingHandler,
];
