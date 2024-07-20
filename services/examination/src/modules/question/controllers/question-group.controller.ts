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
  CreateQuestionGroupRequest,
  GetQuestionGroupListRequest,
  QuestionGroupServiceController,
  QuestionGroupServiceControllerMethods,
  RemoveQuestionGroupRequest,
  UpdateQuestionGroupRequest,
} from '@topexam/api.service.proto/dist/__generated__/question_group.pb';

import { ExaminationService } from '@/modules/examination';

import { QuestionGroupService } from '../services';

@UseInterceptors(new TransformInterceptor())
@UseFilters(new CustomRpcExceptionFilter())
@Controller()
@QuestionGroupServiceControllerMethods()
export class QuestionGroupController implements QuestionGroupServiceController {
  constructor(
    private readonly questionGroupSrv: QuestionGroupService,
    @Inject(forwardRef(() => ExaminationService))
    private readonly examinationSrv: ExaminationService,
  ) {}

  async getQuestionGroupList(request: GetQuestionGroupListRequest) {
    await this._getExaminationItem(request.examinationId);

    const questionGroupList = await this.questionGroupSrv.getQuestionGroupList(
      request.examinationId,
      {
        ...request.aqp,
        filter: JSON.parse(request.aqp.filter),
      },
    );

    return {
      data: questionGroupList,
      meta: {
        next_page_token: null,
        total: 0,
      },
    };
  }

  async createQuestionGroup(request: CreateQuestionGroupRequest) {
    await this._getExaminationItem(request.examinationId);

    return this.questionGroupSrv.createQuestionGroup(
      request.examinationId,
      request.data,
    );
  }

  updateQuestionGroup(request: UpdateQuestionGroupRequest) {
    return this.questionGroupSrv.updateQuestionGroup(
      request.questionGroupId,
      request.data,
    );
  }

  removeQuestionGroup(request: RemoveQuestionGroupRequest) {
    return this.questionGroupSrv.removeQuestionGroup(request.questionGroupId);
  }

  private async _getExaminationItem(examinationId: string) {
    const item = await this.examinationSrv.getExaminationItem(examinationId);
    if (!item)
      throw new RpcNotFoundException({ message: 'Examination not found' });

    return item;
  }
}
