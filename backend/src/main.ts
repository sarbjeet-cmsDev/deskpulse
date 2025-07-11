import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AllExceptionsFilter } from './shared/http-exception.filter';

dotenv.config({ path: '../.env' });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Deskpulse API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();
     app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 422,
      exceptionFactory: (errors) => {
        // You can customize error messages here
        return new UnprocessableEntityException(
          errors.map(err => Object.values(err.constraints)).flat(),
        );
      },
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new AllExceptionsFilter());
   app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

 app.enableCors({
      origin: process.env.CORS_ORIGIN || '*',
      // credentials: true,
    });
  const port = process.env.BACKEND_PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend running on port ${port}`);
}
bootstrap();
