import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { QuestionRepository } from '../../repositories';
import { ILeanFileQuestionDocument } from '../../schemas';
import { GetFileQuestionListQuery } from '../impl';

@QueryHandler(GetFileQuestionListQuery)
export class GetFileQuestionListHandler
  implements IQueryHandler<GetFileQuestionListQuery>
{
  constructor(private readonly repository: QuestionRepository) {}

  async execute(
    query: GetFileQuestionListQuery,
  ): Promise<ILeanFileQuestionDocument[]> {
    Logger.log(
      'Async GetFileQuestionListQuery...',
      'GetFileQuestionListHandler',
    );
    const { examinationId, hasAnswer } = query;
    return this.repository.getFileQuestionList(
      examinationId,
      hasAnswer,
      query.aqp,
    );
  }
}
