import styles from './LoadingSpinner.module.css';
import { useTranslation } from 'react-i18next';

export const LoadingSpinner = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.spinner} ${fullScreen ? styles.fullScreen : ''}`}>
      <div className={styles.loader}></div>
      <p>{t('common.loading')}</p>
    </div>
  );
};
