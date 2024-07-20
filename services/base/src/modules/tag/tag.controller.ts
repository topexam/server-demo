import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import {
  CustomRpcExceptionFilter,
  TransformInterceptor,
} from '@topexam/api.lib.common';
import {
  CreateTagRequest,
  GetTagItemRequest,
  GetTagListRequest,
  TagServiceController,
  TagServiceControllerMethods,
} from '@topexam/api.service.proto/dist/__generated__/tag.pb';

import { TagService } from './tag.service';

@UseInterceptors(new TransformInterceptor())
@UseFilters(new CustomRpcExceptionFilter())
@Controller()
@TagServiceControllerMethods()
export class TagController implements TagServiceController {
  constructor(private readonly tagService: TagService) {}

  async getTagList(request: GetTagListRequest) {
    const tagList = await this.tagService.getTagList({
      ...request.aqp,
      filter: JSON.parse(request.aqp.filter),
    });
    return {
      data: tagList,
      meta: {
        next_page_token: null,
        total: 0,
      },
    };
  }

  async getTagItem(request: GetTagItemRequest) {
    const tagItem = await this.tagService.getTagItem(request.tagId);

    return { data: tagItem };
  }

  createTag(request: CreateTagRequest) {
    return this.tagService.createTag(request.data);
  }
}
