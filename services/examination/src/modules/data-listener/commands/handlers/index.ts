import { CreateSubCategoryHandler } from './create-sub-category.handler';
import { CreateTagHandler } from './create-tag.handler';
import { CreateUserHandler } from './create-user.handler';

export const DataListenerCommandHandlers = [
  CreateUserHandler,
  CreateSubCategoryHandler,
  CreateTagHandler,
];
