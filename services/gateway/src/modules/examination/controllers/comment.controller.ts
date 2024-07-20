import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JoiValidationPipe } from '@topexam/api.lib.common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthUserId } from '@topthithu/nest-authz';

import { loopbackGrpcRequest } from '@/utils';
import { CreateCommentDTO } from '../dto';
import { CreateCommentSchemaValidation } from '../validations';
import {
  EXAMINATION_MODULE_NAME,
  EXAMINATION_MODULE_PREFIX,
  EXAMINATION_MODULE_SERVICE,
} from '../constant';

@ApiTags(EXAMINATION_MODULE_NAME)
@ApiBearerAuth()
@Controller(EXAMINATION_MODULE_PREFIX)
export class CommentController implements OnModuleInit {
  commentSrv: any;
  constructor(@Inject(EXAMINATION_MODULE_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.commentSrv = this.client.getService<any>('CommentService');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('comment/list-by-question/:questionId')
  getCommentListByQuestion(
    @Param('questionId') questionId: string,
  ): Promise<any> {
    return loopbackGrpcRequest(
      this.commentSrv.getCommentListByQuestion({ questionId }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('comment/question-list-by-examination/:examinationId')
  getQuestionListWithLatestCommentByExamination(
    @Param('examinationId') examinationId: string,
  ): Promise<any> {
    return loopbackGrpcRequest(
      this.commentSrv.getQuestionListWithLatestCommentByExamination({
        examinationId,
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('comment:create-comment/:questionId')
  @UsePipes(new JoiValidationPipe(CreateCommentSchemaValidation))
  createComment(
    @AuthUserId() authUserId: string,
    @Param('questionId') questionId: string,
    @Body() payload: CreateCommentDTO,
  ): Promise<any> {
    return loopbackGrpcRequest(
      this.commentSrv.createComment({
        questionId,
        userId: authUserId,
        data: payload,
      }),
    );
  }
}
