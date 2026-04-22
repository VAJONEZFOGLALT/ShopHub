import styles from './LoadingSpinner.module.css';

export const LoadingSpinner = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  return (
    <div className={`${styles.spinner} ${fullScreen ? styles.fullScreen : ''}`}>
      <div className={styles.loader}></div>
      <p>Loading...</p>
    </div>
  );
};
