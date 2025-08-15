// main.ts

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import * as express from "express";
import * as cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { ExpressAdapter } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { join } from "path";
import { AllExceptionsFilter } from "./shared/http-exception.filter";
import { initSocketIO } from "./utils/socket";
dotenv.config({ path: "../.env" });

async function bootstrap() {
  const expressApp = express(); // 👈 use this for both NestJS and Socket.IO
  expressApp.use(express.json({ limit: '10mb' }));
  expressApp.use(express.urlencoded({ limit: '10mb', extended: true }));
  expressApp.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // Create NestJS app with ExpressAdapter
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp)
  );
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
  app.use("/uploads", express.static(join(__dirname, "..", "uploads")));

  const config = new DocumentBuilder()
    .setTitle("Deskpulse API")
    .setDescription("API documentation")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // 👇 Prepare Nest app before starting HTTP server
  await app.init();

  // 👇 Create raw HTTP server (bind both NestJS + Socket.IO here)
  const httpServer = createServer(expressApp);

  // 👇 Initialize Socket.IO
  initSocketIO(httpServer);




  const port = process.env.BACKEND_PORT || 3001;

  // 👇 Start both NestJS and Socket.IO on the same server
  httpServer.listen(port, () => {
    console.log(`🚀 Backend  running on PORT :${port}`);
  });
}

bootstrap();
