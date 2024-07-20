import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { QuestionGroupRepository } from '../../repositories';
import { ILeanQuestionGroupDocument } from '../../schemas';
import { GetQuestionGroupListQuery } from '../impl';

@QueryHandler(GetQuestionGroupListQuery)
export class GetQuestionGroupListHandler
  implements IQueryHandler<GetQuestionGroupListQuery>
{
  constructor(private readonly repository: QuestionGroupRepository) {}

  async execute(
    query: GetQuestionGroupListQuery,
  ): Promise<ILeanQuestionGroupDocument[]> {
    Logger.log(
      'Async GetQuestionGroupListQuery...',
      'GetQuestionGroupListHandler',
    );
    const { examinationId } = query;
    const questionGroupList = await this.repository.getQuestionGroupList(
      examinationId,
      query.aqp,
    );
    return questionGroupList;
  }
}
