import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { QuestionGroupRepository } from '../../repositories';
import { ILeanQuestionGroupDocument } from '../../schemas';
import { GetDefaultQuestionGroupQuery } from '../impl';

@QueryHandler(GetDefaultQuestionGroupQuery)
export class GetDefaultQuestionGroupHandler
  implements IQueryHandler<GetDefaultQuestionGroupQuery>
{
  constructor(private readonly repository: QuestionGroupRepository) {}

  async execute(
    query: GetDefaultQuestionGroupQuery,
  ): Promise<ILeanQuestionGroupDocument> {
    Logger.log(
      'Async GetDefaultQuestionGroupQuery...',
      'GetDefaultQuestionGroupHandler',
    );
    const { examinationId } = query;
    const questionGroup = await this.repository.getDefaultQuestionGroup(
      examinationId,
    );
    return questionGroup;
  }
}
