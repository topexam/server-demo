import { AggregateRoot } from '@nestjs/cqrs';
import { CategoryCreatedEvent } from '../events/impl';

export class CategoryEntity extends AggregateRoot {
  constructor(readonly id: string) {
    super();
  }

  createCategory(): void {
    this.apply(new CategoryCreatedEvent(this.id));
  }
}
