import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

export interface TranslateRequest {
  text: string;
  source: string;
  target: string;
}

export interface TranslateResponse {
  translatedText: string;
}

@Injectable()
export class LibreTranslateService {
  private readonly apiUrl = process.env.LIBRETRANSLATE_API_URL || 'https://api.libretranslate.de';
  private readonly apiKey = process.env.LIBRETRANSLATE_API_KEY;

  private readonly languageMap: Record<string, string> = {
    hu: 'hu',
    en: 'en',
    es: 'es',
  };

  async translate(
    text: string,
    sourceLang: string,
    targetLang: string,
  ): Promise<TranslateResponse> {
    if (!text || text.trim().length === 0) {
      throw new BadRequestException('Text to translate cannot be empty');
    }

    const source = this.languageMap[sourceLang] || sourceLang;
    const target = this.languageMap[targetLang] || targetLang;

    if (!target) {
      throw new BadRequestException(`Unsupported target language: ${targetLang}`);
    }

    try {
      const payload: Record<string, any> = {
        q: text,
        source,
        target,
      };

      if (this.apiKey) {
        payload.api_key = this.apiKey;
      }

      const response = await axios.post(`${this.apiUrl}/translate`, payload, {
        timeout: 10000,
      });

      return {
        translatedText: response.data.translatedText,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new BadRequestException(
          `Translation failed: ${error.response?.data?.message || error.message}`,
        );
      }
      throw new BadRequestException('Translation service error');
    }
  }

  async translateBatch(
    texts: string[],
    sourceLang: string,
    targetLang: string,
  ): Promise<string[]> {
    const results = await Promise.all(
      texts.map((text) => this.translate(text, sourceLang, targetLang)),
    );
    return results.map((r) => r.translatedText);
  }
}
