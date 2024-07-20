import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CustomRpcExceptionFilter,
  RpcNotFoundException,
  TransformInterceptor,
} from '@topexam/api.lib.common';
import {
  GetSubmissionItemRequest,
  GetSubmissionListRequest,
  RequestViewAnswerRequest,
  SubmissionServiceController,
  SubmissionServiceControllerMethods,
  SubmitExaminationRequest,
  TakeExaminationRequest,
} from '@topexam/api.service.proto/dist/__generated__/submission.pb';

import {
  DataListenerService,
  IExaminationDocument,
} from '@/modules/data-listener';

import { SubmissionService } from './submission.service';

@UseInterceptors(new TransformInterceptor())
@UseFilters(new CustomRpcExceptionFilter())
@Controller()
@SubmissionServiceControllerMethods()
export class SubmissionController implements SubmissionServiceController {
  constructor(
    private readonly submissionSrv: SubmissionService,
    private readonly dataListenerSrv: DataListenerService,
  ) {}

  async getSubmissionList(request: GetSubmissionListRequest) {
    await this._getExaminationItem(request.examinationId);

    const submissionList = await this.submissionSrv.getSubmissionList({
      ...request.aqp,
      filter: JSON.parse(request.aqp.filter),
    });

    return {
      data: submissionList,
      meta: {
        next_page_token: null,
        total: 0,
      },
    };
  }

  async getSubmissionItem(request: GetSubmissionItemRequest) {
    const submissionItem = await this.submissionSrv.getSubmissionItem(
      request.submissionId,
    );

    return { data: submissionItem };
  }

  async takeExamination(request: TakeExaminationRequest) {
    await this._getExaminationItem(request.examinationId);

    return this.submissionSrv.createSubmission(
      request.examinationId,
      request.userId,
    );
  }

  submitExamination(request: SubmitExaminationRequest) {
    return this.submissionSrv.submitSubmission(
      request.submissionId,
      request.data,
    );
  }

  @GrpcMethod('SubmissionService', 'requestViewAnswer')
  async requestViewAnswer(request: RequestViewAnswerRequest) {
    await this._getExaminationItem(request.examinationId);

    return this.submissionSrv.requestViewAnswer(
      request.examinationId,
      request.userId,
    );
  }

  async _getExaminationItem(
    examinationId: string,
  ): Promise<IExaminationDocument> {
    const item = await this.dataListenerSrv.getExaminationItem(examinationId);
    if (!item) throw new RpcNotFoundException();

    return item;
  }
}
