import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import {
  CustomRpcExceptionFilter,
  TransformInterceptor,
} from '@topexam/api.lib.common';
import {
  CreateSubCategoryRequest,
  GetSubCategoryItemRequest,
  GetSubCategoryListRequest,
  SubCategoryServiceController,
  SubCategoryServiceControllerMethods,
} from '@topexam/api.service.proto/dist/__generated__/sub_category.pb';

import { SubCategoryService } from './sub-category.service';

@UseInterceptors(new TransformInterceptor())
@UseFilters(new CustomRpcExceptionFilter())
@Controller()
@SubCategoryServiceControllerMethods()
export class SubCategoryController implements SubCategoryServiceController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  async getSubCategoryList(request: GetSubCategoryListRequest) {
    const subCategoryList = await this.subCategoryService.getSubCategoryList({
      ...request.aqp,
      filter: JSON.parse(request.aqp.filter),
    });

    return {
      data: subCategoryList,
      meta: {
        next_page_token: null,
        total: 0,
      },
    };
  }

  async getSubCategoryItem(request: GetSubCategoryItemRequest) {
    const subCategoryItem = await this.subCategoryService.getSubCategoryItem(
      request.subCategoryId,
    );

    return { data: subCategoryItem };
  }

  createSubCategory(request: CreateSubCategoryRequest) {
    return this.subCategoryService.createSubCategory(request.data);
  }
}
