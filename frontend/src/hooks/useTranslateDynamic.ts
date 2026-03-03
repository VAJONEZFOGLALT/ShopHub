import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface UseTranslateDynamicOptions {
  cache?: boolean;
}

const translationCache = new Map<string, Map<string, string>>();

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

const getApiBaseUrl = (): string => {
  const rawBaseUrl = import.meta.env.VITE_API_URL;
  if (typeof rawBaseUrl === 'string' && rawBaseUrl.length > 0) {
    return normalizeBaseUrl(rawBaseUrl);
  }
  return normalizeBaseUrl('http://localhost:3000');
};

const cloneRequestInit = (init: RequestInit): RequestInit => ({
  ...init,
  headers: init.headers ? new Headers(init.headers) : undefined,
});

const postJsonWithPathFallback = async (
  baseUrl: string,
  primaryPath: string,
  fallbackPath: string,
  body: unknown,
) => {
  const init: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const primaryResponse = await fetch(`${baseUrl}${primaryPath}`, cloneRequestInit(init));
  if (primaryResponse.status !== 404) {
    return primaryResponse;
  }

  return fetch(`${baseUrl}${fallbackPath}`, cloneRequestInit(init));
};

export const useTranslateDynamic = (options: UseTranslateDynamicOptions = {}) => {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cache = true } = options;
  const baseUrl = getApiBaseUrl();

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
        const response = await postJsonWithPathFallback(
          baseUrl,
          '/translations/translate',
          '/api/translations/translate',
          {
            text,
            sourceLang: 'en',
            targetLang: target,
          },
        );

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
        const response = await postJsonWithPathFallback(
          baseUrl,
          '/translations/translate-batch',
          '/api/translations/translate-batch',
          {
            texts,
            sourceLang: 'en',
            targetLang: target,
          },
        );

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
