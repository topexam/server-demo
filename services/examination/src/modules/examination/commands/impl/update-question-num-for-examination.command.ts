import { ICommand } from '@nestjs/cqrs';

import { ECommandAction } from '@/enums';

export class UpdateQuestionNumForExaminationCommand implements ICommand {
  constructor(
    public readonly examinationId: string,
    public readonly action: ECommandAction,
  ) {}
}
