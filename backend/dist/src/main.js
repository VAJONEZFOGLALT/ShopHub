"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const origins = [
        process.env.FRONTEND_URL,
        'https://webshopfrontend.vercel.app',
        'http://localhost:5173',
        'http://localhost:5174',
    ].filter((origin) => Boolean(origin));
    app.enableCors({
        origin: origins,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 200,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('WebShop API')
        .setDescription('Complete API documentation for the WebShop e-commerce platform')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication endpoints')
        .addTag('products', 'Product management')
        .addTag('orders', 'Order management')
        .addTag('users', 'User management')
        .addTag('wishlist', 'Wishlist management')
        .addTag('reviews', 'Product reviews')
        .addTag('compare', 'Product comparison')
        .addTag('addresses', 'Shipping addresses')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map