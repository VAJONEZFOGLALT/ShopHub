import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hu from './locales/hu.json';
import en from './locales/en.json';

const resources = {
  hu: { translation: hu },
  en: { translation: en },
};

const SUPPORTED_LANGUAGES = ['hu', 'en'] as const;

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang as (typeof SUPPORTED_LANGUAGES)[number])) {
      return urlLang;
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
