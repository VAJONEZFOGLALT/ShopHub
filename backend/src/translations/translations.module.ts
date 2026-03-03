import { Module } from '@nestjs/common';
import { LibreTranslateService } from './libretranslate.service';
import { TranslationsController } from './translations.controller';

@Module({
  controllers: [TranslationsController],
  providers: [LibreTranslateService],
  exports: [LibreTranslateService],
})
export class TranslationsModule {}
