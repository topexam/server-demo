import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import {
  CustomRpcExceptionFilter,
  TransformInterceptor,
} from '@topexam/api.lib.common';
import {
  ChallengeServiceController,
  ChallengeServiceControllerMethods,
  CreateChallengeRequest,
  DeleteChallengeRequest,
  GetChallengeItemRequest,
  GetChallengeListRequest,
  UpdateChallengeRequest,
} from '@topexam/api.service.proto/dist/__generated__/challenge.pb';

import { ChallengeService } from './challenge.service';

@UseInterceptors(new TransformInterceptor())
@UseFilters(new CustomRpcExceptionFilter())
@Controller()
@ChallengeServiceControllerMethods()
export class ChallengeController implements ChallengeServiceController {
  constructor(private readonly challengeSrv: ChallengeService) {}

  async getChallengeList(request: GetChallengeListRequest) {
    const challengeList = await this.challengeSrv.getChallengeList({
      ...request.aqp,
      filter: JSON.parse(request.aqp.filter),
    });
    return {
      data: challengeList,
      meta: {
        next_page_token: null,
        total: 0,
      },
    };
  }

  async getChallengeItem(request: GetChallengeItemRequest) {
    const challengeItem = await this.challengeSrv.getChallengeItem(
      request.challengeId,
    );

    return {
      data: challengeItem,
    };
  }

  createChallenge(request: CreateChallengeRequest) {
    return this.challengeSrv.createChallenge(request.userId, request.data);
  }

  updateChallenge(request: UpdateChallengeRequest) {
    return this.challengeSrv.updateChallenge(
      request.challengeId,
      request.userId,
      request.data,
    );
  }

  deleteChallenge(request: DeleteChallengeRequest) {
    return this.challengeSrv.deleteChallenge(
      request.challengeId,
      request.userId,
    );
  }
}
