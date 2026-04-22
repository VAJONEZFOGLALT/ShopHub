import { Module } from '@nestjs/common';
import { LibreTranslateService } from './libretranslate.service';
import { OpenaiService } from './openai.service';
import { TranslationsController } from './translations.controller';

@Module({
  controllers: [TranslationsController],
  providers: [LibreTranslateService, OpenaiService],
  exports: [LibreTranslateService, OpenaiService],
})
export class TranslationsModule {}
