import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IApiQueryParams, JoiValidationPipe } from '@topexam/api.lib.common';
import {
  TagServiceClient,
  TAG_SERVICE_NAME,
} from '@topexam/api.service.proto/dist/__generated__/tag.pb';

import { loopbackGrpcRequest } from '@/utils';

import {
  BASE_MODULE_PREFIX,
  BASE_MODULE_SERVICE,
  BASE_MODULE_NAME,
} from '../constant';
import { CreateTagDTO } from '../dto';
import { CreateTagSchemaValidation } from '../validations';
import { ApiQueryParams } from '@/decorators';

@ApiTags(BASE_MODULE_NAME)
@ApiBearerAuth()
@Controller(BASE_MODULE_PREFIX)
export class TagController {
  tagSrv: TagServiceClient;
  constructor(@Inject(BASE_MODULE_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.tagSrv = this.client.getService<TagServiceClient>(TAG_SERVICE_NAME);
  }

  @Get('tag/list')
  getTagList(@ApiQueryParams() aqp: IApiQueryParams) {
    return loopbackGrpcRequest(
      this.tagSrv.getTagList({
        aqp: {
          ...aqp,
          filter: JSON.stringify(aqp.filter),
        },
      }),
    );
  }

  @Get('tag/item/:tagId')
  getTagItem(@Param('tagId') tagId: string) {
    return loopbackGrpcRequest(this.tagSrv.getTagItem({ tagId }));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('tag:create-tag')
  @UsePipes(new JoiValidationPipe(CreateTagSchemaValidation))
  createCategory(@Body() data: CreateTagDTO) {
    return loopbackGrpcRequest(this.tagSrv.createTag({ data }));
  }
}
