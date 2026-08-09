import styles from './progressItem.module.scss';

const ProgressItem = () => {
  return (
    <>
      <div className={styles.item}>
        <div className={styles.subject}>Математика</div>
        <div className={styles.progressContainer}>
          <div className={styles.progress}></div>
        </div>
      </div>
    </>
  );
};

export default ProgressItem;
