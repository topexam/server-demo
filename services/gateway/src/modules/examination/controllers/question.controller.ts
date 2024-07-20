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
  QuestionServiceClient,
  QUESTION_SERVICE_NAME,
} from '@topexam/api.service.proto/dist/__generated__/question.pb';

import { loopbackGrpcRequest } from '@/utils';
import {
  EXAMINATION_MODULE_NAME,
  EXAMINATION_MODULE_PREFIX,
  EXAMINATION_MODULE_SERVICE,
} from '../constant';
import {
  CreateBulkQuestionDTO,
  CreateQuestionDTO,
  UpdateQuestionDTO,
} from '../dto';
import {
  CreateBulkQuestionSchemaValidation,
  CreateQuestionSchemaValidation,
  UpdateQuestionSchemaValidation,
} from '../validations';
import { ApiQueryParams } from '@/decorators';

@ApiTags(EXAMINATION_MODULE_NAME)
@ApiBearerAuth()
@Controller(EXAMINATION_MODULE_PREFIX)
export class QuestionController implements OnModuleInit {
  questionSrv: QuestionServiceClient;
  constructor(@Inject(EXAMINATION_MODULE_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.questionSrv = this.client.getService<QuestionServiceClient>(
      QUESTION_SERVICE_NAME,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('question/list/:examinationId')
  async getQuestionList(
    @Param('examinationId') examinationId: string,
    @ApiQueryParams() aqp: IApiQueryParams,
  ) {
    return loopbackGrpcRequest(
      this.questionSrv.getQuestionList({
        examinationId,
        viewAnswer: false,
        aqp: {
          ...aqp,
          filter: JSON.stringify(aqp.filter),
        },
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('question/list-with-answer/:examinationId')
  async getQuestionListWithAnswerByExamination(
    @Param('examinationId') examinationId: string,
    @ApiQueryParams() aqp: IApiQueryParams,
  ) {
    return loopbackGrpcRequest(
      this.questionSrv.getQuestionList({
        examinationId,
        viewAnswer: true,
        aqp: {
          ...aqp,
          filter: JSON.stringify(aqp.filter),
        },
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('file-question/list/:examinationId')
  async getFileQuestionListByExamination(
    @Param('examinationId') examinationId: string,
    @ApiQueryParams() aqp: IApiQueryParams,
  ) {
    return loopbackGrpcRequest(
      this.questionSrv.getFileQuestionList({
        examinationId,
        viewAnswer: false,
        aqp: {
          ...aqp,
          filter: JSON.stringify(aqp.filter),
        },
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('file-question/list-with-answer/:examinationId')
  async getFileQuestionListWithAnswerByExamination(
    @Param('examinationId') examinationId: string,
    @ApiQueryParams() aqp: IApiQueryParams,
  ) {
    return loopbackGrpcRequest(
      this.questionSrv.getFileQuestionList({
        examinationId,
        viewAnswer: true,
        aqp: {
          ...aqp,
          filter: JSON.stringify(aqp.filter),
        },
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('question/item/:examinationId/:questionId')
  getQuestionItemById(@Param('questionId') questionId: string) {
    return loopbackGrpcRequest(
      this.questionSrv.getQuestionItemById({ questionId }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('question(:)create-question/:examinationId')
  @UsePipes(new JoiValidationPipe(CreateQuestionSchemaValidation))
  async createQuestion(
    @Param('examinationId') examinationId: string,
    @Body() payload: CreateQuestionDTO,
  ) {
    return loopbackGrpcRequest(
      this.questionSrv.createQuestion({
        examinationId,
        data: {
          ...payload,
          options: payload.options ?? [],
          answers: { ...payload.answers },
        },
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('question(:)create-bulk-question/:examinationId')
  @UsePipes(new JoiValidationPipe(CreateBulkQuestionSchemaValidation))
  async createBulkQuestion(
    @Param('examinationId') examinationId: string,
    @Body() payload: CreateBulkQuestionDTO,
  ) {
    return loopbackGrpcRequest(
      this.questionSrv.createBulkQuestion({
        examinationId,
        data: {
          ...payload,
          questions: payload.questions?.map((e) => ({
            ...e,
            options: e.options ?? [],
            answers: { ...e.answers },
          })),
        },
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('question:update-question/:examinationId/:questionId')
  @UsePipes(new JoiValidationPipe(UpdateQuestionSchemaValidation))
  updateQuestion(
    @Param('questionId') questionId: string,
    @Body() payload: UpdateQuestionDTO,
  ) {
    return loopbackGrpcRequest(
      this.questionSrv.updateQuestion({
        questionId,
        data: { ...payload, options: payload.options ?? [] },
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('question:remove-question/:examinationId/:questionId')
  removeQuestion(@Param('questionId') questionId: string) {
    return loopbackGrpcRequest(this.questionSrv.removeQuestion({ questionId }));
  }
}
