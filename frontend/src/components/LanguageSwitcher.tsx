import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

const normalizeLanguage = (value: string) => value.toLowerCase().split('-')[0];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'hu', label: 'Magyar' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
  ];

  const handleLanguageChange = (langCode: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('lang', langCode);
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    localStorage.setItem('language', langCode);
    // Reload page immediately to fetch fresh data with new language
    window.location.href = nextUrl;
  };

  const currentLanguage = normalizeLanguage(i18n.resolvedLanguage || i18n.language || 'hu');
  const selectedLanguage = languages.some((lang) => lang.code === currentLanguage)
    ? currentLanguage
    : 'hu';

  return (
    <div className={styles.languageSwitcher}>
      <label htmlFor="language-select" className={styles.label}>
        {i18n.t('common.language')}:
      </label>
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className={styles.select}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};
