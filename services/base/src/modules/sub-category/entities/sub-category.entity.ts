import { AggregateRoot } from '@nestjs/cqrs';

import { SubCategoryCreatedEvent } from '../events/impl';

export class SubCategoryEntity extends AggregateRoot {
  constructor(readonly id: string) {
    super();
  }

  createSubCategory(): void {
    this.apply(new SubCategoryCreatedEvent(this.id));
  }
}
