import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { QuestionGroupRepository } from '../../repositories';
import { ILeanQuestionGroupDocument } from '../../schemas';
import { GetQuestionGroupItemQuery } from '../impl';

@QueryHandler(GetQuestionGroupItemQuery)
export class GetQuestionGroupItemHandler
  implements IQueryHandler<GetQuestionGroupItemQuery>
{
  constructor(private readonly repository: QuestionGroupRepository) {}

  async execute(
    query: GetQuestionGroupItemQuery,
  ): Promise<ILeanQuestionGroupDocument> {
    Logger.log(
      'Async GetQuestionGroupItemQuery...',
      'GetQuestionGroupItemHandler',
    );
    const { questionGroupId } = query;
    const questionGroup = await this.repository.getQuestionGroupItem(
      questionGroupId,
    );
    return questionGroup;
  }
}
