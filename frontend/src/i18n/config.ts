import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hu from './locales/hu.json';
import en from './locales/en.json';

const resources = {
  hu: { translation: hu },
  en: { translation: en },
};

const SUPPORTED_LANGUAGES = ['hu', 'en'] as const;

const normalizeLanguage = (value: string) => value.toLowerCase().split('-')[0];

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang) {
      const normalizedUrlLang = normalizeLanguage(urlLang);
      if (SUPPORTED_LANGUAGES.includes(normalizedUrlLang as (typeof SUPPORTED_LANGUAGES)[number])) {
        return normalizedUrlLang;
      }
    }

    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      const normalizedStoredLang = normalizeLanguage(storedLang);
      if (SUPPORTED_LANGUAGES.includes(normalizedStoredLang as (typeof SUPPORTED_LANGUAGES)[number])) {
        return normalizedStoredLang;
      }
    }
  }

  return 'hu';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'hu',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
