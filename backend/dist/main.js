"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const dotenv = require("dotenv");
const express = require("express");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const http_exception_filter_1 = require("./shared/http-exception.filter");
dotenv.config({ path: '../.env' });
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Deskpulse API')
        .setDescription('API documentation')
        .setVersion('1.0')
        .build();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        errorHttpStatusCode: 422,
        exceptionFactory: (errors) => {
            return new common_1.UnprocessableEntityException(errors.map(err => Object.values(err.constraints)).flat());
        },
    }));
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.use('/uploads', express.static((0, path_1.join)(__dirname, '..', 'uploads')));
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
    });
    const port = process.env.BACKEND_PORT || 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`Backend running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map