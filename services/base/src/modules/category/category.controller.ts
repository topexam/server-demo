import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import {
  CustomRpcExceptionFilter,
  TransformInterceptor,
} from '@topexam/api.lib.common';
import {
  CategoryServiceController,
  CategoryServiceControllerMethods,
  CreateCategoryRequest,
  GetCategoryItemRequest,
  GetCategoryListRequest,
} from '@topexam/api.service.proto/dist/__generated__/category.pb';

import { CategoryService } from './category.service';

@UseInterceptors(new TransformInterceptor())
@UseFilters(new CustomRpcExceptionFilter())
@Controller()
@CategoryServiceControllerMethods()
export class CategoryController implements CategoryServiceController {
  constructor(private readonly categoryService: CategoryService) {}

  async getCategoryList(request: GetCategoryListRequest) {
    const categoryList = await this.categoryService.getCategoryList({
      ...request.aqp,
      filter: JSON.parse(request.aqp.filter),
    });
    return {
      data: categoryList,
      meta: { next_page_token: null, total: 0 },
    };
  }

  async getCategoryItem(request: GetCategoryItemRequest) {
    const categoryItem = await this.categoryService.getCategoryItem(
      request.categoryId,
    );

    return { data: categoryItem };
  }

  createCategory(request: CreateCategoryRequest) {
    return this.categoryService.createCategory(request.data);
  }
}
