// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // --- CORS setup ---
  const origins = [
    process.env.FRONTEND_URL,
    'https://shophub-fe.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
  ].filter((origin): origin is string => Boolean(origin));

  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  });

  app.setGlobalPrefix('api');

  // --- Swagger / OpenAPI setup ---
  const config = new DocumentBuilder()
    .setTitle('ShopHub API')
    .setDescription(
      'Detailed API documentation for the ShopHub e-commerce platform. It covers authentication, products, orders, addresses, reviews, wishlist, compare, recently viewed, translations, and admin operations.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste the access token returned by the auth endpoints.',
      },
      'bearer-auth',
    )
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // --- Global validation pipe ---
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Backend running on port ${process.env.PORT ?? 3000}`);
}

void bootstrap();