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
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClientGrpc } from '@nestjs/microservices';
import { IApiQueryParams, JoiValidationPipe } from '@topexam/api.lib.common';
import {
  QuestionGroupServiceClient,
  QUESTION_GROUP_SERVICE_NAME,
} from '@topexam/api.service.proto/dist/__generated__/question_group.pb';

import { loopbackGrpcRequest } from '@/utils';
import {
  EXAMINATION_MODULE_PREFIX,
  EXAMINATION_MODULE_SERVICE,
  EXAMINATION_MODULE_NAME,
} from '../constant';
import { CreateQuestionGroupDTO, UpdateQuestionGroupDTO } from '../dto';
import {
  CreateQuestionGroupSchemaValidation,
  UpdateQuestionGroupSchemaValidation,
} from '../validations';
import { ApiQueryParams } from '@/decorators';

@ApiTags(EXAMINATION_MODULE_NAME)
@ApiBearerAuth()
@Controller(EXAMINATION_MODULE_PREFIX)
export class QuestionGroupController implements OnModuleInit {
  questionGroupSrv: QuestionGroupServiceClient;
  constructor(@Inject(EXAMINATION_MODULE_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.questionGroupSrv = this.client.getService<QuestionGroupServiceClient>(
      QUESTION_GROUP_SERVICE_NAME,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('question-group/list/:examinationId')
  async getQuestionGroupList(
    @Param('examinationId') examinationId: string,
    @ApiQueryParams() aqp: IApiQueryParams,
  ) {
    return loopbackGrpcRequest(
      this.questionGroupSrv.getQuestionGroupList({
        examinationId,
        aqp: {
          ...aqp,
          filter: JSON.stringify(aqp.filter),
        },
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('question-group:create-question-group/:examinationId')
  @UsePipes(new JoiValidationPipe(CreateQuestionGroupSchemaValidation))
  async createQuestionGroup(
    @Param('examinationId') examinationId: string,
    @Body() data: CreateQuestionGroupDTO,
  ) {
    return loopbackGrpcRequest(
      this.questionGroupSrv.createQuestionGroup({ examinationId, data }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('question-group:update-question-group/:examinationId/:questionGroupId')
  @UsePipes(new JoiValidationPipe(UpdateQuestionGroupSchemaValidation))
  updateQuestionGroup(
    @Param('questionGroupId') questionGroupId: string,
    @Body() data: UpdateQuestionGroupDTO,
  ) {
    return loopbackGrpcRequest(
      this.questionGroupSrv.updateQuestionGroup({ questionGroupId, data }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(
    'question-group:remove-question-group/:examinationId/:questionGroupId',
  )
  removeQuestionGroup(@Param('questionGroupId') questionGroupId: string) {
    return loopbackGrpcRequest(
      this.questionGroupSrv.removeQuestionGroup({ questionGroupId }),
    );
  }
}
