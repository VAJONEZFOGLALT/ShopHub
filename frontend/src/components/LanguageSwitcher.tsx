import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'hu', label: 'Magyar' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  return (
    <div className={styles.languageSwitcher}>
      <label htmlFor="language-select" className={styles.label}>
        {i18n.t('common.language')}:
      </label>
      <select
        id="language-select"
        value={i18n.language}
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
