import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

export const setupSecurityConfig = (app: INestApplication): void => {
  app.enableCors();
  app.use(helmet());
  app.use(cookieParser());
  // app.use(csurf({ cookie: true }));
};
