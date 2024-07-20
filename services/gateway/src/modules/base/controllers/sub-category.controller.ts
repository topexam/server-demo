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
  SubCategoryServiceClient,
  SUB_CATEGORY_SERVICE_NAME,
} from '@topexam/api.service.proto/dist/__generated__/sub_category.pb';

import { loopbackGrpcRequest } from '@/utils';

import {
  BASE_MODULE_PREFIX,
  BASE_MODULE_SERVICE,
  BASE_MODULE_NAME,
} from '../constant';
import { CreateSubCategoryDTO } from '../dto';
import { CreateSubCategorySchemaValidation } from '../validations';
import { ApiQueryParams } from '@/decorators';

@ApiTags(BASE_MODULE_NAME)
@ApiBearerAuth()
@Controller(BASE_MODULE_PREFIX)
export class SubCategoryController {
  subCategorySrv: SubCategoryServiceClient;
  constructor(@Inject(BASE_MODULE_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.subCategorySrv = this.client.getService<SubCategoryServiceClient>(
      SUB_CATEGORY_SERVICE_NAME,
    );
  }

  @Get('sub-category/list')
  getSubCategoryList(@ApiQueryParams() aqp: IApiQueryParams) {
    return loopbackGrpcRequest(
      this.subCategorySrv.getSubCategoryList({
        aqp: {
          ...aqp,
          filter: JSON.stringify(aqp.filter),
        },
      }),
    );
  }

  @Get('sub-category/item/:subCategoryId')
  getSubCategoryItem(@Param('subCategoryId') subCategoryId: string) {
    return loopbackGrpcRequest(
      this.subCategorySrv.getSubCategoryItem({ subCategoryId }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sub-category:create-sub-category')
  @UsePipes(new JoiValidationPipe(CreateSubCategorySchemaValidation))
  createSubCategory(@Body() data: CreateSubCategoryDTO) {
    return loopbackGrpcRequest(this.subCategorySrv.createSubCategory({ data }));
  }
}
