import { Module } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { LibreTranslateService } from './libretranslate.service';
import { TranslationsController } from './translations.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TranslationsController],
  providers: [TranslationsService, LibreTranslateService, PrismaService],
  exports: [TranslationsService, LibreTranslateService],
})
export class TranslationsModule {}
