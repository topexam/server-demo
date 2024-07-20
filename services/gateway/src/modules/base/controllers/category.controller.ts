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
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IApiQueryParams, JoiValidationPipe } from '@topexam/api.lib.common';
import {
  CATEGORY_SERVICE_NAME,
  CategoryServiceClient,
} from '@topexam/api.service.proto/dist/__generated__/category.pb';

import { loopbackGrpcRequest } from '@/utils';
import {
  BASE_MODULE_PREFIX,
  BASE_MODULE_SERVICE,
  BASE_MODULE_NAME,
} from '../constant';
import { CreateCategoryDTO } from '../dto';
import { CreateCategorySchemaValidation } from '../validations';
import { ApiQueryParams } from '@/decorators';

@ApiTags(BASE_MODULE_NAME)
@ApiBearerAuth()
@Controller(BASE_MODULE_PREFIX)
export class CategoryController implements OnModuleInit {
  categorySrv: CategoryServiceClient;
  constructor(@Inject(BASE_MODULE_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.categorySrv = this.client.getService<CategoryServiceClient>(
      CATEGORY_SERVICE_NAME,
    );
  }

  @Get('category/list')
  getCategoryList(@ApiQueryParams() aqp: IApiQueryParams) {
    return loopbackGrpcRequest(
      this.categorySrv.getCategoryList({
        aqp: {
          ...aqp,
          filter: JSON.stringify(aqp.filter),
        },
      }),
    );
  }

  @Get('category/item/:categoryId')
  getCategoryItem(@Param('categoryId') categoryId: string) {
    return loopbackGrpcRequest(
      this.categorySrv.getCategoryItem({ categoryId }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('category:create-category')
  @UsePipes(new JoiValidationPipe(CreateCategorySchemaValidation))
  createCategory(@Body() data: CreateCategoryDTO) {
    return loopbackGrpcRequest(this.categorySrv.createCategory({ data }));
  }
}
