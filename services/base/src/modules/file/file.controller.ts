import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import {
  CustomRpcExceptionFilter,
  TransformInterceptor,
} from '@topexam/api.lib.common';
import {
  FileServiceControllerMethods,
  FileServiceController,
  GetFileItemRequest,
  GetFileDataRequest,
  GenerateUploadUrlRequest,
} from '@topexam/api.service.proto/dist/__generated__/file.pb';

import { FileService } from './file.service';

@UseInterceptors(new TransformInterceptor())
@UseFilters(new CustomRpcExceptionFilter())
@Controller()
@FileServiceControllerMethods()
export class FileController implements FileServiceController {
  constructor(private readonly fileSrv: FileService) {}

  generateUploadUrl(request: GenerateUploadUrlRequest) {
    return this.fileSrv.generateUploadUrl(request.uploaderId, request.data);
  }

  async getFileData(request: GetFileDataRequest) {
    const fileUrl = await this.fileSrv.getFileData(request.fileId);
    return { data: { file_url: fileUrl } };
  }

  async getFileItem(request: GetFileItemRequest) {
    const fileItem = await this.fileSrv.getFileItem(request.fileId);

    return { data: fileItem };
  }
}
