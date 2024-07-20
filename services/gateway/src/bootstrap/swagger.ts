import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export const setupSwaggerConfig = (app: INestApplication): void => {
  const configSrv = app.get(ConfigService);
  const version = configSrv.get<string>('APP.VERSION');

  const configDocument = new DocumentBuilder()
    .setTitle('TopExam API')
    .setDescription('The TopExam API description')
    .setVersion(version)
    .addApiKey({ type: 'apiKey', in: 'header' }, 'X-API-KEY')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configDocument);
  SwaggerModule.setup(`v${version}/specs`, app, document);
  Logger.log(`/v${version}/specs`, 'Swagger Docs');
};
