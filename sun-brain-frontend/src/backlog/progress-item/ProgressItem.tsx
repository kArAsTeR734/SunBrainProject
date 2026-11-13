import styles from './progressItem.module.scss';

const ProgressItem = () => {
  return (
    <>
      <div className={styles.item}>
        <div className={styles.subject}>Математика</div>
        <div className={styles.progressContainer} role="progressbar" aria-label="Математика, пример прогресса" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.progress}></div>
        </div>
      </div>
    </>
  );
};

export default ProgressItem;
