import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CheckBasicAuthMiddleware implements NestMiddleware {
  constructor(private configSrv: ConfigService) {}

  use(req: Request, _: Response, next: NextFunction): void {
    const apiKey = req.headers['x-api-key'];
    const basicAuthToken = this.configSrv.get<string>('APP.BASIC_AUTH_TOKEN');
    if (!apiKey || apiKey !== basicAuthToken) {
      throw new ForbiddenException();
    }

    next();
  }
}
