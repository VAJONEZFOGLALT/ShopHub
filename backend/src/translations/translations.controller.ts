import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { LibreTranslateService } from './libretranslate.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('translations')
@Controller('translations')
export class TranslationsController {
  constructor(private readonly libreTranslateService: LibreTranslateService) {}

  @Post('translate')
  @ApiOperation({ summary: 'Translate text using LibreTranslate' })
  @ApiBody({
    schema: {
      example: {
        text: 'Kategoria: Elektronika',
        sourceLang: 'hu',
        targetLang: 'en',
      },
    },
  })
  @ApiOkResponse({ description: 'Translated text.' })
  async translate(
    @Body()
    body: {
      text: string;
      sourceLang?: string;
      targetLang: string;
    },
  ) {
    if (!body.text || !body.targetLang) {
      throw new BadRequestException('text and targetLang are required');
    }

    return await this.libreTranslateService.translate(
      body.text,
      body.sourceLang || 'en',
      body.targetLang,
    );
  }

  @Post('translate-batch')
  @ApiOperation({ summary: 'Translate multiple texts using LibreTranslate' })
  @ApiBody({
    schema: {
      example: {
        texts: ['Kategoria: Elektronika', 'Kategoria: Otthon'],
        sourceLang: 'hu',
        targetLang: 'en',
      },
    },
  })
  @ApiOkResponse({ description: 'Translated texts array.' })
  async translateBatch(
    @Body()
    body: {
      texts: string[];
      sourceLang?: string;
      targetLang: string;
    },
  ) {
    if (!Array.isArray(body.texts) || body.texts.length === 0 || !body.targetLang) {
      throw new BadRequestException('texts array and targetLang are required');
    }

    return await this.libreTranslateService.translateBatch(
      body.texts,
      body.sourceLang || 'en',
      body.targetLang,
    );
  }
}
