import {
  Controller,
  forwardRef,
  Inject,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  CustomRpcExceptionFilter,
  RpcNotFoundException,
  TransformInterceptor,
} from '@topexam/api.lib.common';
import {
  CreateBulkQuestionRequest,
  CreateQuestionRequest,
  GetFileQuestionListRequest,
  GetQuestionItemByIdRequest,
  GetQuestionListRequest,
  QuestionServiceController,
  QuestionServiceControllerMethods,
  RemoveQuestionRequest,
  UpdateQuestionRequest,
} from '@topexam/api.service.proto/dist/__generated__/question.pb';

import {
  ExaminationService,
  convertListToLinkList,
} from '@/modules/examination';

import { ILeanNormalQuestionDocument } from '../schemas';
import { QuestionService } from '../services';
import { EQuestionType } from '../enums';

@UseInterceptors(new TransformInterceptor())
@UseFilters(new CustomRpcExceptionFilter())
@Controller()
@QuestionServiceControllerMethods()
export class QuestionController implements QuestionServiceController {
  constructor(
    private readonly questionSrv: QuestionService,
    @Inject(forwardRef(() => ExaminationService))
    private readonly examinationSrv: ExaminationService,
  ) {}

  async getQuestionList(request: GetQuestionListRequest) {
    await this._getExaminationItem(request.examinationId);

    const questionList = await this.questionSrv.getQuestionList(
      request.examinationId,
      request.viewAnswer,
      {
        ...request.aqp,
        filter: JSON.parse(request.aqp.filter),
      },
    );

    const transformedQuestionList =
      convertListToLinkList<ILeanNormalQuestionDocument>(questionList, []);

    return {
      data: transformedQuestionList,
      meta: {
        next_page_token: null,
        total: 0,
      },
    };
  }

  async getFileQuestionList(request: GetFileQuestionListRequest) {
    await this._getExaminationItem(request.examinationId);

    const questionList = await this.questionSrv.getFileQuestionList(
      request.examinationId,
      request.viewAnswer,
      {
        ...request.aqp,
        filter: JSON.parse(request.aqp.filter),
      },
    );

    return {
      data: questionList,
      meta: {
        next_page_token: null,
        total: 0,
      },
    };
  }

  async getQuestionItemById(request: GetQuestionItemByIdRequest) {
    const questionItem = await this.questionSrv.getQuestionItem(
      request.questionId,
    );

    return { data: questionItem };
  }

  async createQuestion(request: CreateQuestionRequest) {
    await this._getExaminationItem(request.examinationId);

    return this.questionSrv.createQuestion(request.examinationId, request.data);
  }

  async createBulkQuestion(request: CreateBulkQuestionRequest) {
    await this._getExaminationItem(request.examinationId);

    return this.questionSrv.createBulkQuestion(
      request.examinationId,
      request.data,
    );
  }

  updateQuestion(request: UpdateQuestionRequest) {
    return this.questionSrv.updateQuestion(request.questionId, {
      ...request.data,
      question_type: request.data.question_type as EQuestionType | undefined,
    });
  }

  removeQuestion(request: RemoveQuestionRequest) {
    return this.questionSrv.removeQuestion(request.questionId);
  }

  private async _getExaminationItem(examinationId: string) {
    const item = await this.examinationSrv.getExaminationItem(examinationId);
    if (!item)
      throw new RpcNotFoundException({ message: 'Examination not found' });

    return item;
  }
}
