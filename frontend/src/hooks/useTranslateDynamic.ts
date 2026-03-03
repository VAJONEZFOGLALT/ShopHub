import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface UseTranslateDynamicOptions {
  cache?: boolean;
}

const translationCache = new Map<string, Map<string, string>>();

export const useTranslateDynamic = (options: UseTranslateDynamicOptions = {}) => {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cache = true } = options;

  const translate = useCallback(
    async (text: string, targetLang?: string): Promise<string> => {
      const target = targetLang || i18n.language;

      // Return as-is if target is source language
      if (target === 'en' && text) {
        return text;
      }

      // Check cache
      if (cache) {
        const cached = translationCache.get(target)?.get(text);
        if (cached) {
          return cached;
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/translations/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            sourceLang: 'en',
            targetLang: target,
          }),
        });

        if (!response.ok) {
          throw new Error(`Translation failed: ${response.statusText}`);
        }

        const data = await response.json();
        const translated = data.translatedText;

        // Cache result
        if (cache) {
          if (!translationCache.has(target)) {
            translationCache.set(target, new Map());
          }
          translationCache.get(target)!.set(text, translated);
        }

        return translated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Translation error';
        setError(message);
        return text; // Return original text on error
      } finally {
        setIsLoading(false);
      }
    },
    [i18n.language, cache],
  );

  const translateBatch = useCallback(
    async (texts: string[], targetLang?: string): Promise<string[]> => {
      const target = targetLang || i18n.language;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/translations/translate-batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            texts,
            sourceLang: 'en',
            targetLang: target,
          }),
        });

        if (!response.ok) {
          throw new Error(`Batch translation failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Assuming API returns array of strings directly
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Translation error';
        setError(message);
        return texts; // Return original texts on error
      } finally {
        setIsLoading(false);
      }
    },
    [i18n.language],
  );

  const clearCache = useCallback(() => {
    translationCache.clear();
  }, []);

  return {
    translate,
    translateBatch,
    isLoading,
    error,
    clearCache,
  };
};
