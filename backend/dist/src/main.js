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
        'https://shophub-fe.vercel.app',
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
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('ShopHub API')
        .setDescription('Detailed API documentation for the ShopHub e-commerce platform. It covers authentication, products, orders, addresses, reviews, wishlist, compare, recently viewed, translations, and admin operations.')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste the access token returned by the auth endpoints.',
    }, 'bearer-auth')
        .addTag('auth', 'Registration, login, and token refresh')
        .addTag('products', 'Product catalog, search, and featured showcase')
        .addTag('orders', 'Order creation, ownership checks, and status updates')
        .addTag('users', 'User registration, profile, and avatar management')
        .addTag('wishlist', 'Wishlist operations')
        .addTag('reviews', 'Product review read/write operations')
        .addTag('compare', 'Compare list operations')
        .addTag('addresses', 'Shipping address management')
        .addTag('recently-viewed', 'Recently viewed product tracking')
        .addTag('translations', 'Text translation helper endpoints')
        .addTag('order-items', 'Admin order item management')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        useGlobalPrefix: true,
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Backend running on port ${process.env.PORT ?? 3000}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map