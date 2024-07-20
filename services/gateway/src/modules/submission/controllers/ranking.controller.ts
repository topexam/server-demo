import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthUserId } from '@topthithu/nest-authz';
import { ClientGrpc } from '@nestjs/microservices';
import {
  RankingServiceClient,
  RANKING_SERVICE_NAME,
} from '@topexam/api.service.proto/dist/__generated__/ranking.pb';

import { loopbackGrpcRequest } from '@/utils';
import {
  SUBMISSION_MODULE_NAME,
  SUBMISSION_MODULE_PREFIX,
  SUBMISSION_MODULE_SERVICE,
} from '../constant';
import { ApiQueryParams } from '@/decorators';
import { IApiQueryParams } from '@topexam/api.lib.common';

@ApiTags(SUBMISSION_MODULE_NAME)
@ApiBearerAuth()
@Controller(SUBMISSION_MODULE_PREFIX)
export class RankingController implements OnModuleInit {
  rankingSrv: RankingServiceClient;
  constructor(@Inject(SUBMISSION_MODULE_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.rankingSrv = this.client.getService(RANKING_SERVICE_NAME);
  }

  @Get('examination/:examinationId/ranking')
  getRankingListByExamination(
    @Param('examinationId') examinationId: string,
    @ApiQueryParams() aqp: IApiQueryParams,
  ) {
    return loopbackGrpcRequest(
      this.rankingSrv.getSubmissionRankingList({
        examinationId,
        aqp: {
          ...aqp,
          filter: JSON.stringify(aqp.filter),
        },
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('examination/:examinationId/user-ranking')
  async getUserRankingByExamination(
    @AuthUserId() authUserId: string,
    @Param('examinationId') examinationId: string,
  ) {
    return loopbackGrpcRequest(
      this.rankingSrv.getUserRankingItem({
        examinationId,
        userId: authUserId,
      }),
    );
  }
}
