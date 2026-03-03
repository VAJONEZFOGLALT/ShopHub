import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { TranslationsModule } from '../translations/translations.module';

@Module({
  imports: [CloudinaryModule, TranslationsModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
