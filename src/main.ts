import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      skipUndefinedProperties: true,
    }),
  );
  app.enableVersioning();
  await app.listen(3000);
}
bootstrap();
