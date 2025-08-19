import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createServer } from "http";
import * as express from "express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe, UnprocessableEntityException } from "@nestjs/common";
import { join } from "path";
import { AllExceptionsFilter } from "./shared/http-exception.filter";
import { initSocketIO } from "./utils/socket";
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 422,
      exceptionFactory: (errors) => {
        return new UnprocessableEntityException(
          errors.map((err) => Object.values(err.constraints)).flat()
        );
      },
    })
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use("/uploads", require("express").static(join(__dirname, "..", "uploads")));

  const config = new DocumentBuilder()
    .setTitle("Deskpulse API")
    .setDescription("API documentation")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.enableCors({
    origin: process.env.SOCKET_FRONTEND,
    credentials: true,
  });

  await app.init();

  const httpServer = app.getHttpServer();

  initSocketIO(httpServer);

  const port = process.env.BACKEND_PORT || 3001;
  await app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Backend running on PORT: ${port}`);
  });
}

bootstrap();
