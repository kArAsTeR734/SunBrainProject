import ProgressList from '@/backlog/progress-list/ProgressList.tsx';

import styles from './studentAccountProgress.module.scss';

const StudentAccountProgress = () => {
  return (
    <>
      <div className={styles.progress}>
        <h2 className={styles.header}>Прогресс обучения</h2>
        <ProgressList />
      </div>
    </>
  );
};

export default StudentAccountProgress;
