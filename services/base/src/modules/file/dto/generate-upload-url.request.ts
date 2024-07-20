import { GenerateUploadUrlDTO } from './generate-upload-url.dto';

export class GenerateUploadUrlRequest {
  uploaderId: string;
  data: GenerateUploadUrlDTO;
}
