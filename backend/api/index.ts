import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import express, { Request, Response } from 'express';

let cachedServer: express.Express;

async function bootstrapServer(): Promise<express.Express> {
  if (!cachedServer) {
    try {
      const expressApp = express();
      const adapter = new ExpressAdapter(expressApp);
      
      const app = await NestFactory.create(AppModule, adapter);

      const origins = [
        process.env.FRONTEND_URL,
        'https://webshopfrontend.vercel.app',
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

      const config = new DocumentBuilder()
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

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
          persistAuthorization: true,
        },
      });

      app.useGlobalPipes(new ValidationPipe());
      
      await app.init();
      
      cachedServer = expressApp;
    } catch (error) {
      console.error('Failed to bootstrap server:', error);
      throw error;
    }
  }
  
  return cachedServer;
}

export default async function handler(req: Request, res: Response) {
  try {
    const server = await bootstrapServer();
    server(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Server initialization failed' });
  }
}
