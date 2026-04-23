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

  private fallbackTranslation(text: string): string {
    return text;
  }

  private readonly libApiUrl = process.env.LIBRETRANSLATE_API_URL || 'https://api.libretranslate.de';
  private readonly libApiKey = process.env.LIBRETRANSLATE_API_KEY;
  private readonly deepLApiUrl = 'https://api-free.deepl.com/v1/translate';
  private readonly myMemoryApiUrl = 'https://api.mymemory.translated.net/get';

  private readonly languageMap: Record<string, string> = {
    hu: 'hu',
    en: 'en',
  };

  private readonly deepLLanguageMap: Record<string, string> = {
    hu: 'HU',
    en: 'EN',
  };

  async translate(
    text: string,
    sourceLang: string,
    targetLang: string,
    context?: string,
  ): Promise<TranslateResponse> {
    if (!text || text.trim().length === 0) {
      throw new BadRequestException('Text to translate cannot be empty');
    }

    const source = this.languageMap[sourceLang] || sourceLang;
    const target = this.languageMap[targetLang] || targetLang;

    if (!target) {
      throw new BadRequestException(`Unsupported target language: ${targetLang}`);
    }

    // Try services in order of speed/quality:
    // For HU→EN: DeepL first (fast) > OpenAI (slower but better) > fallbacks
    // For other pairs: OpenAI > DeepL > fallbacks
    
    const isHuToEn = (source === 'hu' || source === 'hu-HU') && (target === 'en' || target === 'en-US');
    
    if (isHuToEn) {
      // Fast path for Hungarian→English: DeepL is super fast and good
      try {
        const translatedText = await this.translateWithDeepL(text, source, target);
        console.log('✓ DeepL succeeded (fast HU→EN)');
        return { translatedText };
      } catch (deepLError) {
        console.warn('⚠ DeepL unavailable, trying OpenAI...');
        try {
          const translatedText = await this.openaiService.translate(text, source, target, context);
          return { translatedText };
        } catch (openaiError) {
          console.warn('⚠ OpenAI unavailable, trying LibreTranslate...');
          try {
            const translatedText = await this.translateWithLibreTranslate(text, source, target);
            return { translatedText };
          } catch (libError) {
            try {
              const translatedText = await this.translateWithMyMemory(text, source, target);
              return { translatedText };
            } catch (memoryError) {
              console.error('All translation services failed:', { deepLError, openaiError, libError, memoryError });
              return { translatedText: this.fallbackTranslation(text) };
            }
          }
        }
      }
    }

    // Other language pairs: try all services
    try {
      const translatedText = await this.openaiService.translate(text, source, target, context);
      return { translatedText };
    } catch (openaiError) {
      console.warn('⚠ OpenAI unavailable, trying DeepL...');
      try {
        const translatedText = await this.translateWithDeepL(text, source, target);
        console.log('✓ DeepL succeeded (OpenAI fallback)');
        return { translatedText };
      } catch (deepLError) {
        console.warn('⚠ DeepL unavailable, trying LibreTranslate...');
        try {
          const translatedText = await this.translateWithLibreTranslate(text, source, target);
          console.log('✓ LibreTranslate succeeded (DeepL fallback)');
          return { translatedText };
        } catch (libError) {
          console.warn('⚠ LibreTranslate unavailable, trying MyMemory...');
          try {
            const translatedText = await this.translateWithMyMemory(text, source, target);
            console.log('✓ MyMemory succeeded (LibreTranslate fallback)');
            return { translatedText };
          } catch (memoryError) {
            console.error('All translation services failed:', { openaiError, deepLError, libError, memoryError });
            return { translatedText: this.fallbackTranslation(text) };
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
    context?: string,
  ): Promise<string[]> {
    if (texts.length === 0) {
      return [];
    }

    const source = this.languageMap[sourceLang] || sourceLang;
    const target = this.languageMap[targetLang] || targetLang;

    // For HU→EN: skip slow OpenAI, use fast DeepL
    const isHuToEn = (source === 'hu' || source === 'hu-HU') && (target === 'en' || target === 'en-US');
    
    if (isHuToEn) {
      try {
        console.log(`✓ Using DeepL for fast HU→EN batch (${texts.length} items)`);
        const results = await Promise.all(
          texts.map((text) => this.translateWithDeepL(text, source, target)),
        );
        return results;
      } catch (deepLError) {
        console.warn(`⚠ DeepL batch failed, falling back to individual translations`);
        const results = await Promise.all(
          texts.map((text) => this.translate(text, source, target)),
        );
        return results.map((r, index) => r.translatedText || this.fallbackTranslation(texts[index]));
      }
    }

    // Other language pairs: try OpenAI first
    try {
      const results = await this.openaiService.translateBatch(texts, source, target, context);
      console.log(`✓ OpenAI batch-translated ${texts.length} items`);
      return results;
    } catch (openaiError) {
      console.warn(`⚠ OpenAI batch failed, falling back to DeepL or individual translations`);
      // Fallback to individual translations via regular translate (which has its own fallback chain)
      const results = await Promise.all(
        texts.map((text) => this.translate(text, source, target)),
      );
      return results.map((r, index) => r.translatedText || this.fallbackTranslation(texts[index]));
    }
  }
}
