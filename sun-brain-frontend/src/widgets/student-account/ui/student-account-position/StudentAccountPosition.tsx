import { PositionList } from '@widgets/student-account';

import styles from './studentAccountPosition.module.scss';

export const StudentAccountPosition = () => {
  return (
    <>
      <div className={styles.position}>
        <div className={styles.wrapper}>
          <div className={styles.header}>Текущая позиция в рейтинге</div>
          <PositionList />
        </div>
      </div>
    </>
  );
};
