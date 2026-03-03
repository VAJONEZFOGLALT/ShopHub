import { Module } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { TranslationsController } from './translations.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TranslationsController],
  providers: [TranslationsService, PrismaService],
  exports: [TranslationsService],
})
export class TranslationsModule {}
