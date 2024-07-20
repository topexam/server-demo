import { AggregateRoot } from '@nestjs/cqrs';

import { TagCreatedEvent } from '../events/impl';

export class TagEntity extends AggregateRoot {
  constructor(readonly id: string) {
    super();
  }

  createTag(): void {
    this.apply(new TagCreatedEvent(this.id));
  }
}
