import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { QuestionRepository } from '../../repositories';
import { ILeanNormalQuestionDocument } from '../../schemas';
import { GetQuestionItemQuery } from '../impl';

@QueryHandler(GetQuestionItemQuery)
export class GetQuestionItemHandler
  implements IQueryHandler<GetQuestionItemQuery>
{
  constructor(private readonly repository: QuestionRepository) {}

  async execute(
    query: GetQuestionItemQuery,
  ): Promise<ILeanNormalQuestionDocument> {
    Logger.log('Async GetQuestionItemQuery...', 'GetQuestionItemHandler');
    const { questionId } = query;
    const questionGroup = await this.repository.getQuestionItem(questionId);
    return questionGroup;
  }
}
