import { ICommand } from '@nestjs/cqrs';

import { CreateReviewDTO } from '../../dto';

export class CreateReviewCommand implements ICommand {
  constructor(
    public readonly examinationId: string,
    public readonly userId: string,
    public readonly createReviewDTO: CreateReviewDTO,
  ) {}
}
