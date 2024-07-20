import { ICommand } from '@nestjs/cqrs';

import { ECommandAction } from '@/enums';

export class UpdateSubCategoryCommand implements ICommand {
  constructor(
    public readonly categoryId: string,
    public readonly data: {
      subCategoryId: string;
      action: ECommandAction;
    },
  ) {}
}
