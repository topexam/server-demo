import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  UsePipes,
  Inject,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JoiValidationPipe } from '@topexam/api.lib.common';
import { AuthUserId } from '@topthithu/nest-authz';
import {
  FileServiceClient,
  FILE_SERVICE_NAME,
} from '@topexam/api.service.proto/dist/__generated__/file.pb';

import { loopbackGrpcRequest } from '@/utils';
import {
  BASE_MODULE_PREFIX,
  BASE_MODULE_SERVICE,
  BASE_MODULE_NAME,
} from '../constant';
import { GenerateUploadUrlDTO } from '../dto';
import { GenerateUploadUrlSchemaValidation } from '../validations';

@ApiTags(BASE_MODULE_NAME)
@ApiBearerAuth()
@Controller(BASE_MODULE_PREFIX)
@Controller()
export class FileController {
  fileSrv: FileServiceClient;
  constructor(@Inject(BASE_MODULE_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.fileSrv = this.client.getService<FileServiceClient>(FILE_SERVICE_NAME);
  }

  @Get('file/data/:resourceId/:fileId')
  async getFileData(
    @Param('fileId') fileId: string,
    // @Param('resourceId') resourceId: string,
  ): Promise<any> {
    return loopbackGrpcRequest(
      this.fileSrv.getFileData({
        fileId,
      }),
    );
  }

  @Get('file/item/:resourceId/:fileId')
  async getFileItem(@Param('fileId') fileId: string) {
    return loopbackGrpcRequest(this.fileSrv.getFileItem({ fileId }));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('file:generate-upload-url')
  @UsePipes(new JoiValidationPipe(GenerateUploadUrlSchemaValidation))
  generateUploadUrl(
    @AuthUserId() authUserId: string,
    @Body() data: GenerateUploadUrlDTO,
  ): Promise<any> {
    return loopbackGrpcRequest(
      this.fileSrv.generateUploadUrl({ uploaderId: authUserId, data }),
    );
  }
}
