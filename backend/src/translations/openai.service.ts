import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenaiService {
  private readonly apiKey = process.env.OPENAI_API_KEY;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly timeout = 15000; // 15 second timeout for OpenAI API

  private readonly languageNames: Record<string, string> = {
    hu: 'Hungarian',
    en: 'English',
  };

  async translateBatch(
    texts: string[],
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<string[]> {
    if (!this.apiKey) {
      throw new BadRequestException('OpenAI API key not configured');
    }

    if (texts.length === 0) {
      return [];
    }

    const sourceLang = this.languageNames[sourceLanguage] || sourceLanguage;
    const targetLang = this.languageNames[targetLanguage] || targetLanguage;

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
          temperature: 0,
          messages: [
            {
              role: 'system',
            content: `You are a professional e-commerce translator. Translate from ${sourceLang} to ${targetLang}.

CRITICAL RULES:
- Return ONLY the translations, one per line, in exact same order as input
- No numbering, quotes, formatting, or explanations
- Be concise and natural - use terms a native ${targetLang} speaker would use
- Preserve the meaning exactly

For product categories, use these standard translations:
HUNGARIAN → ENGLISH:
- Elektronika → Electronics
- Kiegészítők → Accessories
- Iroda → Office
- Otthon → Home
- Divat → Fashion
- Sport → Sports

For product descriptions, be technical but accessible.`,
            },
            {
              role: 'user',
              content: `Translate these ${texts.length} items from ${sourceLang} to ${targetLang}:\n\n${texts.join('\n')}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: this.timeout,
        },
      );

      const content = response.data.choices?.[0]?.message?.content || '';
      const translations = content
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0);

      // Ensure we return same number of translations as inputs
      if (translations.length !== texts.length) {
        console.warn(
          `Expected ${texts.length} translations but got ${translations.length}`,
        );
      }

      console.log(`✓ OpenAI translated ${texts.length} items from ${sourceLang} to ${targetLang}`);
      return translations.slice(0, texts.length);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        console.warn(`✗ OpenAI failed (${error.code}): ${errorMsg}`);
      } else {
        console.warn(`✗ OpenAI error: ${error instanceof Error ? error.message : String(error)}`);
      }
      throw new BadRequestException('OpenAI translation failed');
    }
  }

  async translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    const results = await this.translateBatch([text], sourceLanguage, targetLanguage);
    return results[0] || text;
  }
}
