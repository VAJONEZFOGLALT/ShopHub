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
    context?: string,
  ): Promise<string[]> {
    if (!this.apiKey) {
      throw new BadRequestException('OpenAI API key not configured');
    }

    if (texts.length === 0) {
      return [];
    }

    const sourceLang = this.languageNames[sourceLanguage] || sourceLanguage;
    const targetLang = this.languageNames[targetLanguage] || targetLanguage;
    const contextInstructions = context?.trim()
      ? `\n\nCONTEXT:\n${context.trim()}\n`
      : '\n';

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-4o-mini',
          temperature: 0,
          messages: [
            {
              role: 'system',
              content: `You are a professional e-commerce translator. Translate from ${sourceLang} to ${targetLang}.

CRITICAL RULES:
- Return ONLY valid JSON in the form of an array of strings.
- The array must contain exactly one translation per input item and preserve order.
- Do not wrap the JSON in markdown or extra text.
- Be concise and natural - use terms a native ${targetLang} speaker would use in e-commerce
- Preserve the meaning exactly

Guidelines:
${contextInstructions}- For product names/descriptions: be technical but accessible
- For categories: use common e-commerce category terminology, usually short noun phrases
- Never be overly literal - prioritize what makes sense in context`,
            },
            {
              role: 'user',
              content: `Translate these ${texts.length} items from ${sourceLang} to ${targetLang}:\n\n${JSON.stringify(texts)}`,
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
      let translations: string[] = [];

      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          translations = parsed.map((item) => String(item).trim()).filter((line) => line.length > 0);
        }
      } catch {
        translations = content
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0)
          .map((line: string) => line.replace(/^[-*\d.\s]+/, '').trim());
      }

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
    context?: string,
  ): Promise<string> {
    const results = await this.translateBatch([text], sourceLanguage, targetLanguage, context);
    return results[0] || text;
  }
}
