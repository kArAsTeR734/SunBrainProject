import HomeworkList from './HomeworkList';
import styles from './StudentHomework.module.scss';

export const StudentHomework = () => {
  return (
    <>
      <section className={styles.studentHomework} aria-label="homework">
        <div className="container">
          <HomeworkList />
        </div>
      </section>
    </>
  );
};
