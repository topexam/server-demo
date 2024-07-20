import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { QuestionRepository } from '../../repositories';
import { ILeanNormalQuestionDocument } from '../../schemas';
import { GetQuestionListQuery } from '../impl';

@QueryHandler(GetQuestionListQuery)
export class GetQuestionListHandler
  implements IQueryHandler<GetQuestionListQuery>
{
  constructor(private readonly repository: QuestionRepository) {}

  async execute(
    query: GetQuestionListQuery,
  ): Promise<ILeanNormalQuestionDocument[]> {
    Logger.log('Async GetQuestionListQuery...', 'GetQuestionListHandler');
    const { examinationId, hasAnswer } = query;
    return this.repository.getQuestionList(examinationId, hasAnswer, query.aqp);
  }
}
