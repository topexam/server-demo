import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClientGrpc } from '@nestjs/microservices';
import { Response } from 'express';
import { IApiQueryParams, JoiValidationPipe } from '@topexam/api.lib.common';
import { AuthUserId } from '@topthithu/nest-authz';
import {
  ExaminationServiceClient,
  EXAMINATION_SERVICE_NAME,
} from '@topexam/api.service.proto/dist/__generated__/examination.pb';
import { firstValueFrom } from 'rxjs';

import { loopbackGrpcRequest } from '@/utils';
import {
  CreateExaminationDTO,
  CreateQuestionListFromFileDTO,
  UpdateExaminationDTO,
} from '../dto';
import {
  CreateExaminationSchemaValidation,
  CreateQuestionListFromPDFSchemaValidation,
  UpdateExaminationSchemaValidation,
} from '../validations';
import {
  EXAMINATION_MODULE_NAME,
  EXAMINATION_MODULE_PREFIX,
  EXAMINATION_MODULE_SERVICE,
} from '../constant';
import { ApiQueryParams } from '@/decorators';

@ApiTags(EXAMINATION_MODULE_NAME)
@ApiBearerAuth()
@Controller(EXAMINATION_MODULE_PREFIX)
export class ExaminationController implements OnModuleInit {
  examinationSrv: ExaminationServiceClient;
  constructor(@Inject(EXAMINATION_MODULE_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.examinationSrv = this.client.getService<ExaminationServiceClient>(
      EXAMINATION_SERVICE_NAME,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('examination/list')
  getExaminationList(@ApiQueryParams() aqp: IApiQueryParams) {
    return loopbackGrpcRequest(
      this.examinationSrv.getExaminationList({
        aqp: {
          ...aqp,
          filter: JSON.stringify(aqp.filter),
        },
      }),
    );
  }

  @Get('examination/list-related/:examinationId')
  getExaminationListRelated(
    @Param('examinationId') examinationId: string,
    @ApiQueryParams() aqp: IApiQueryParams,
  ) {
    return loopbackGrpcRequest(
      this.examinationSrv.getExaminationListRelated({
        examinationId,
        aqp: {
          ...aqp,
          filter: JSON.stringify(aqp.filter),
        },
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('examination/list-recommended')
  getExaminationListRecommended(
    @AuthUserId() userId: string,
    @ApiQueryParams() aqp: IApiQueryParams,
  ) {
    return loopbackGrpcRequest(
      this.examinationSrv.getExaminationListRecommended({
        userId,
        aqp: {
          ...aqp,
          filter: JSON.stringify(aqp.filter),
        },
      }),
    );
  }

  @Get('examination/item/:examinationId')
  getExaminationItem(@Param('examinationId') examinationId: string) {
    return loopbackGrpcRequest(
      this.examinationSrv.getExaminationItem({
        examinationId,
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('examination(:)create-examination')
  @UsePipes(new JoiValidationPipe(CreateExaminationSchemaValidation))
  createExamination(
    @AuthUserId() authUserId: string,
    @Body() payload: CreateExaminationDTO,
  ) {
    return loopbackGrpcRequest(
      this.examinationSrv.createExamination({
        authorId: authUserId,
        data: {
          ...payload,
          sub_category_id: payload.sub_category_id,
          tag_ids: payload.tag_ids ?? [],
        },
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('examination(:)generate-pdf/:examinationId')
  async generateExaminationPDF(
    @Res() res: Response,
    @Param('examinationId') examinationId: string,
  ) {
    const pdfBuffer = await firstValueFrom(
      this.examinationSrv.generatePdfFromExamination({
        examinationId,
      }),
    );
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=examination_file.pdf',
      'Content-Length': 0,
    });
    return res.end(pdfBuffer);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('examination(:)update-examination/:examinationId')
  @UsePipes(new JoiValidationPipe(UpdateExaminationSchemaValidation))
  updateExamination(
    @Param('examinationId') examinationId: string,
    @Body() payload: UpdateExaminationDTO,
  ) {
    return loopbackGrpcRequest(
      this.examinationSrv.updateExamination({
        examinationId,
        data: {
          ...payload,
          sub_category_id: payload.sub_category_id,
          tag_ids: payload.tag_ids ?? [],
        },
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('examination(:)create-question-list-from-file/:examinationId')
  @UsePipes(new JoiValidationPipe(CreateQuestionListFromPDFSchemaValidation))
  createQuestionListFromFile(
    @Param('examinationId') examinationId: string,
    @Body() payload: CreateQuestionListFromFileDTO,
  ) {
    return loopbackGrpcRequest(
      this.examinationSrv.createQuestionListFromFile({
        examinationId,
        data: payload,
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('examination(:)remove-examination/:examinationId')
  deleteExamination(@Param('examinationId') examinationId: string) {
    return loopbackGrpcRequest(
      this.examinationSrv.deleteExamination({ examinationId }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('examination(:)publish-examination/:examinationId')
  publishExamination(@Param('examinationId') examinationId: string) {
    return loopbackGrpcRequest(
      this.examinationSrv.publishExamination({ examinationId }),
    );
  }
}
