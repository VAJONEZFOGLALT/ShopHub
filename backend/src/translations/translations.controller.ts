import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { SupportedLanguage } from '@prisma/client';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('translations')
@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get('languages')
  @ApiOperation({ summary: 'Get all supported languages' })
  getSupportedLanguages() {
    return this.translationsService.getSupportedLanguages();
  }

  @Get(':language')
  @ApiOperation({ summary: 'Get all translations for a language' })
  async getTranslationsByLanguage(@Param('language') language: string) {
    if (!Object.values(SupportedLanguage).includes(language as SupportedLanguage)) {
      throw new BadRequestException(`Unsupported language: ${language}`);
    }

    return await this.translationsService.getTranslationsByLanguage(
      language as SupportedLanguage,
    );
  }

  @Get(':language/:key')
  @ApiOperation({ summary: 'Get a specific translation' })
  async getTranslation(
    @Param('language') language: string,
    @Param('key') key: string,
  ) {
    if (!Object.values(SupportedLanguage).includes(language as SupportedLanguage)) {
      throw new BadRequestException(`Unsupported language: ${language}`);
    }

    const translation = await this.translationsService.getTranslation(
      key,
      language as SupportedLanguage,
    );

    if (!translation) {
      throw new BadRequestException(
        `Translation not found for key: ${key} and language: ${language}`,
      );
    }

    return translation;
  }

  @Post(':language/:key')
  @ApiOperation({ summary: 'Set/update a translation' })
  async setTranslation(
    @Param('language') language: string,
    @Param('key') key: string,
    @Body('value') value: string,
  ) {
    if (!Object.values(SupportedLanguage).includes(language as SupportedLanguage)) {
      throw new BadRequestException(`Unsupported language: ${language}`);
    }

    if (!value || value.trim().length === 0) {
      throw new BadRequestException('Translation value cannot be empty');
    }

    return await this.translationsService.setTranslation(
      key,
      language as SupportedLanguage,
      value,
    );
  }

  @Post('batch')
  @ApiOperation({ summary: 'Batch set translations' })
  async batchSetTranslations(
    @Body()
    translations: Array<{
      key: string;
      language: SupportedLanguage;
      value: string;
    }>,
  ) {
    if (!Array.isArray(translations) || translations.length === 0) {
      throw new BadRequestException('Translations array cannot be empty');
    }

    return await this.translationsService.batchSetTranslations(translations);
  }
}
