import { ICommand } from '@nestjs/cqrs';

import { ECountPropertyKey } from '../../enums';

export class CountExaminationPropertyCommand implements ICommand {
  constructor(
    public readonly examinationId: string,
    public readonly countPropertyKey: ECountPropertyKey,
  ) {}
}
