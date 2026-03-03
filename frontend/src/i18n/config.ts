import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hu from './locales/hu.json';
import en from './locales/en.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import pl from './locales/pl.json';
import cz from './locales/cz.json';
import it from './locales/it.json';

const resources = {
  hu: { translation: hu },
  en: { translation: en },
  de: { translation: de },
  fr: { translation: fr },
  es: { translation: es },
  pl: { translation: pl },
  cz: { translation: cz },
  it: { translation: it },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'hu',
  fallbackLng: 'hu',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
