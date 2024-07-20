import { ICommand } from '@nestjs/cqrs';

import { UpdateReviewDTO } from '../../dto';

export class UpdateReviewCommand implements ICommand {
  constructor(
    public readonly reviewId: string,
    public readonly userId: string,
    public readonly updateReviewDTO: UpdateReviewDTO,
  ) {}
}
