import { ICommand } from '@nestjs/cqrs';

import { GenerateUploadUrlDTO } from '../../dto';

export class GenerateUploadUrlCommand implements ICommand {
  constructor(
    public readonly uploaderId: string,
    public readonly generateUploadUrlDTO: GenerateUploadUrlDTO,
  ) {}
}
