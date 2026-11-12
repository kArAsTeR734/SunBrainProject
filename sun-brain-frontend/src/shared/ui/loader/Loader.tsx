import styles from './Loader.module.scss';

export const Loader = () => {
  return (
    <div className={styles.container} role="status" aria-label="Загрузка страницы">
      <div className={styles.loader} aria-hidden="true" />
    </div>
  );
};
