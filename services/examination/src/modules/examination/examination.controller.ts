import { Controller, UseFilters } from '@nestjs/common';
import { CustomRpcExceptionFilter } from '@topexam/api.lib.common';
import {
  ExaminationServiceControllerMethods,
  ExaminationServiceController,
  CreateExaminationRequest,
  GetExaminationListRequest,
  GetExaminationListRelatedRequest,
  UpdateExaminationRequest,
  CreateQuestionListFromFileRequest,
  DeleteExaminationRequest,
  PublishExaminationRequest,
  GetExaminationListRecommendedRequest,
  GeneratePDFFromExaminationRequest,
  GetExaminationItemRequest,
} from '@topexam/api.service.proto/dist/__generated__/examination.pb';

import { ExaminationService } from './examination.service';
import { EExaminationMode, EExaminationStatus } from './enums';

@UseFilters(new CustomRpcExceptionFilter())
@Controller()
@ExaminationServiceControllerMethods()
export default class ExaminationController
  implements ExaminationServiceController
{
  constructor(private readonly examinationSrv: ExaminationService) {}

  async getExaminationList(request: GetExaminationListRequest) {
    const examinationList = await this.examinationSrv.getExaminationList({
      ...request.aqp,
      filter: JSON.parse(request.aqp.filter),
    });

    return {
      data: examinationList,
      meta: {
        next_page_token: null,
        total: 0,
      },
    };
  }

  async getExaminationListRelated(request: GetExaminationListRelatedRequest) {
    const examinationList = await this.examinationSrv.getExaminationListRelated(
      request.examinationId,
      {
        ...request.aqp,
        filter: JSON.parse(request.aqp.filter),
      },
    );

    return {
      data: examinationList,
      meta: {
        next_page_token: null,
        total: 0,
      },
    };
  }

  async getExaminationListRecommended(
    request: GetExaminationListRecommendedRequest,
  ) {
    const examinationList =
      await this.examinationSrv.getExaminationListRecommended(request.userId, {
        ...request.aqp,
        filter: JSON.parse(request.aqp.filter),
      });

    return {
      data: examinationList,
      meta: {
        next_page_token: null,
        total: 0,
      },
    };
  }

  async getExaminationItem(request: GetExaminationItemRequest) {
    const examinationItem =
      await this.examinationSrv.getExaminationItemWithExtraData(
        request.examinationId,
      );

    return { data: examinationItem };
  }

  createExamination(request: CreateExaminationRequest) {
    return this.examinationSrv.createExamination({
      ...request.data,
      author_id: request.authorId,
    });
  }

  updateExamination(request: UpdateExaminationRequest) {
    return this.examinationSrv.updateExamination(request.examinationId, {
      ...request.data,
      status: request.data.status as EExaminationStatus | undefined,
      mode: request.data.mode as EExaminationMode | undefined,
    });
  }

  async generatePdfFromExamination(request: GeneratePDFFromExaminationRequest) {
    await this.examinationSrv.generateExaminationPDF(request.examinationId);

    // const pdfBuffer = await this.examinationSrv.generateExaminationPDF(
    //   request.examinationId,
    // );
    // res.writeHead(200, {
    //   'Content-Type': 'application/pdf',
    //   'Content-Disposition': 'attachment; filename=examination_file.pdf',
    //   'Content-Length': pdfBuffer.length,
    // });
    // res.end(pdfBuffer);

    return {
      success: true,
    };
  }

  createQuestionListFromFile(request: CreateQuestionListFromFileRequest) {
    return this.examinationSrv.createQuestionListFromFile(
      request.examinationId,
      request.data,
    );
  }

  deleteExamination(deleteExamination: DeleteExaminationRequest) {
    return this.examinationSrv.deleteExamination(
      deleteExamination.examinationId,
    );
  }

  publishExamination(publishExamination: PublishExaminationRequest) {
    return this.examinationSrv.publishExamination(
      publishExamination.examinationId,
    );
  }
}
