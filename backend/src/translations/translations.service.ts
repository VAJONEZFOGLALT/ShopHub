import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SupportedLanguage } from '../../generated/prisma/enums';

@Injectable()
export class TranslationsService {
  constructor(private readonly prisma: PrismaService) {}

  // Get translation by key and language
  async getTranslation(key: string, language: SupportedLanguage) {
    try {
      return await this.prisma.translation.findUnique({
        where: {
          key_language: {
            key,
            language,
          },
        },
      });
    } catch (error) {
      console.error(`Failed to get translation for ${key}:`, error);
      return null;
    }
  }

  // Get all translations for a specific language
  async getTranslationsByLanguage(language: SupportedLanguage) {
    try {
      const translations = await this.prisma.translation.findMany({
        where: { language },
      });

      // Convert to key-value object
      return translations.reduce(
        (acc, trans) => {
          acc[trans.key] = trans.value;
          return acc;
        },
        {} as Record<string, string>,
      );
    } catch (error) {
      console.error(`Failed to get translations for ${language}:`, error);
      return {};
    }
  }

  // Set/update translation
  async setTranslation(
    key: string,
    language: SupportedLanguage,
    value: string,
  ) {
    try {
      return await this.prisma.translation.upsert({
        where: {
          key_language: {
            key,
            language,
          },
        },
        create: { key, language, value },
        update: { value },
      });
    } catch (error) {
      console.error(`Failed to set translation for ${key}:`, error);
      throw error;
    }
  }

  // Batch set translations
  async batchSetTranslations(
    translations: Array<{
      key: string;
      language: SupportedLanguage;
      value: string;
    }>,
  ) {
    try {
      const results = await Promise.all(
        translations.map((t) =>
          this.setTranslation(t.key, t.language, t.value),
        ),
      );
      return results;
    } catch (error) {
      console.error('Failed to batch set translations:', error);
      throw error;
    }
  }

  // Get all supported languages
  getSupportedLanguages(): SupportedLanguage[] {
    return Object.values(SupportedLanguage);
  }
}
