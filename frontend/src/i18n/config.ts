import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hu from './locales/hu.json';
import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
  hu: { translation: hu },
  en: { translation: en },
  es: { translation: es },
};

const SUPPORTED_LANGUAGES = ['hu', 'en', 'es'] as const;

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang as (typeof SUPPORTED_LANGUAGES)[number])) {
      return urlLang;
    }
  }

  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage as (typeof SUPPORTED_LANGUAGES)[number])) {
    return savedLanguage;
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
