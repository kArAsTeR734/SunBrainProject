import HomeworkList from './homework-list';
import styles from './StudentHomework.module.scss';

export const StudentHomework = () => {
  return (
    <>
      <section className={styles.studentHomework} aria-label="homework">
        <h1 className={styles.title}>Домашние задания</h1>
        <HomeworkList />
      </section>
    </>
  );
};
