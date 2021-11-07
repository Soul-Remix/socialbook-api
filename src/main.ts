import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      skipUndefinedProperties: true,
      whitelist: true,
    }),
  );
  app.enableCors();
  app.use(helmet());
  await app.listen(8000);
}
bootstrap();
