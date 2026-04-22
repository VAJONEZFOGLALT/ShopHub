import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { OpenaiService } from './openai.service';

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
  constructor(private readonly openaiService: OpenaiService) {}

  private readonly libApiUrl = process.env.LIBRETRANSLATE_API_URL || 'https://api.libretranslate.de';
  private readonly libApiKey = process.env.LIBRETRANSLATE_API_KEY;
  private readonly deepLApiUrl = 'https://api-free.deepl.com/v1/translate';
  private readonly myMemoryApiUrl = 'https://api.mymemory.translated.net/get';

  private readonly languageMap: Record<string, string> = {
    hu: 'hu',
    en: 'en',
    es: 'es',
  };

  private readonly deepLLanguageMap: Record<string, string> = {
    hu: 'HU',
    en: 'EN',
    es: 'ES',
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

    // Try services in order of quality: OpenAI > DeepL > LibreTranslate > MyMemory
    try {
      const translatedText = await this.openaiService.translate(text, source, target);
      return { translatedText };
    } catch (openaiError) {
      try {
        const translatedText = await this.translateWithDeepL(text, source, target);
        return { translatedText };
      } catch (deepLError) {
        try {
          const translatedText = await this.translateWithLibreTranslate(text, source, target);
          return { translatedText };
        } catch (libError) {
          try {
            const translatedText = await this.translateWithMyMemory(text, source, target);
            return { translatedText };
          } catch (memoryError) {
            console.error('All translation services failed:', { openaiError, deepLError, libError, memoryError });
            throw new BadRequestException('All translation services unavailable');
          }
        }
      }
    }
  }

  private async translateWithDeepL(text: string, source: string, target: string): Promise<string> {
    const deepLSource = source === 'hu' ? 'HU' : source.toUpperCase();
    const deepLTarget = this.deepLLanguageMap[target] || target.toUpperCase();

    const response = await axios.post(
      this.deepLApiUrl,
      {
        text: [text],
        source_lang: deepLSource,
        target_lang: deepLTarget,
      },
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      },
    );

    const translated = response?.data?.translations?.[0]?.text;
    if (typeof translated !== 'string' || translated.trim().length === 0) {
      throw new Error('DeepL returned empty translation');
    }

    return translated;
  }

  private async translateWithLibreTranslate(text: string, source: string, target: string): Promise<string> {
    const payload: Record<string, any> = {
      q: text,
      source,
      target,
    };

    if (this.libApiKey) {
      payload.api_key = this.libApiKey;
    }

    const response = await axios.post(`${this.libApiUrl}/translate`, payload, {
      timeout: 10000,
    });

    const translated = response?.data?.translatedText;
    if (typeof translated !== 'string' || translated.trim().length === 0) {
      throw new Error('LibreTranslate returned empty translation');
    }

    return translated;
  }

  private async translateWithMyMemory(text: string, source: string, target: string): Promise<string> {
    const response = await axios.get(this.myMemoryApiUrl, {
      params: {
        q: text,
        langpair: `${source}|${target}`,
      },
      timeout: 10000,
    });

    const translated = response?.data?.responseData?.translatedText;
    if (typeof translated !== 'string' || translated.trim().length === 0) {
      throw new Error('MyMemory returned empty translation');
    }

    return translated;
  }

  async translateBatch(
    texts: string[],
    sourceLang: string,
    targetLang: string,
  ): Promise<string[]> {
    if (texts.length === 0) {
      return [];
    }

    const source = this.languageMap[sourceLang] || sourceLang;
    const target = this.languageMap[targetLang] || targetLang;

    // Try OpenAI first for better batch handling
    try {
      return await this.openaiService.translateBatch(texts, source, target);
    } catch (openaiError) {
      console.warn('OpenAI batch translation failed, falling back to individual translations');
      // Fallback to individual translations
      const results = await Promise.all(
        texts.map((text) => this.translate(text, source, target)),
      );
      return results.map((r) => r.translatedText);
    }
  }
}
