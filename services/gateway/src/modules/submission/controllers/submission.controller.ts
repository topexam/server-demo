import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthUserId } from '@topthithu/nest-authz';
import { ClientGrpc } from '@nestjs/microservices';
import {
  SubmissionServiceClient,
  SUBMISSION_SERVICE_NAME,
} from '@topexam/api.service.proto/dist/__generated__/submission.pb';

import { loopbackGrpcRequest } from '@/utils';
import {
  SUBMISSION_MODULE_NAME,
  SUBMISSION_MODULE_PREFIX,
  SUBMISSION_MODULE_SERVICE,
} from '../constant';
import { SubmitExaminationDTO } from '../dto';
import { ApiQueryParams } from '@/decorators';
import { IApiQueryParams } from '@topexam/api.lib.common';

@ApiTags(SUBMISSION_MODULE_NAME)
@ApiBearerAuth()
@Controller(SUBMISSION_MODULE_PREFIX)
export class SubmissionController implements OnModuleInit {
  submissionSrv: SubmissionServiceClient;
  constructor(@Inject(SUBMISSION_MODULE_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.submissionSrv = this.client.getService(SUBMISSION_SERVICE_NAME);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('submission/list/:examinationId')
  getSubmissionList(
    @AuthUserId() authUserId: string,
    @Param('examinationId') examinationId: string,
    @ApiQueryParams() aqp: IApiQueryParams,
  ) {
    return loopbackGrpcRequest(
      this.submissionSrv.getSubmissionList({
        examinationId,
        userId: authUserId,
        aqp: {
          ...aqp,
          filter: JSON.stringify(aqp.filter),
        },
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('submission/item/:submissionId')
  getSubmissionItem(@Param('submissionId') submissionId: string) {
    return loopbackGrpcRequest(
      this.submissionSrv.getSubmissionItem({ submissionId }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('submission(:)create-submission/:examinationId')
  takeExamination(
    @AuthUserId() authUserId: string,
    @Param('examinationId') examinationId: string,
  ) {
    return loopbackGrpcRequest(
      this.submissionSrv.takeExamination({
        examinationId,
        userId: authUserId,
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('submission(:)submit-submission/:submissionId')
  submitExamination(
    @Param('submissionId') submissionId: string,
    @Body() payload: SubmitExaminationDTO,
  ) {
    return loopbackGrpcRequest(
      this.submissionSrv.submitExamination({
        submissionId,
        data: payload,
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('examination(:)request-view-answer/:examinationId')
  requestViewAnswer(
    @AuthUserId() authUserId: string,
    @Param('examinationId') examinationId: string,
  ) {
    return loopbackGrpcRequest(
      this.submissionSrv.requestViewAnswer({
        examinationId,
        userId: authUserId,
      }),
    );
  }
}
