import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenaiService {
  private readonly apiKey = process.env.OPENAI_API_KEY;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

  private readonly languageNames: Record<string, string> = {
    hu: 'Hungarian',
    en: 'English',
    es: 'Spanish',
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
              content: `You are a professional translator. Translate the provided texts from ${sourceLang} to ${targetLang}. 
              
              Return ONLY the translations, one per line, in the exact same order as the input.
              Do not add numbering, quotes, or any other formatting.
              Prioritize natural, context-aware translations that a native speaker would use.
              For product categories and common terms, use standard translations.`,
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

      return translations.slice(0, texts.length);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('OpenAI translation error:', error.response?.data || error.message);
      } else {
        console.error('OpenAI translation error:', error);
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
