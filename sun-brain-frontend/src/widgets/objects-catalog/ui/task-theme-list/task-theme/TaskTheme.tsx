import type { Topic } from '@features/topics';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';

import type { SubjectId } from '../../../model/Subject';
import styles from './taskTheme.module.scss';

const TaskTheme: FC<Topic> = ({ name, id, number }: Topic) => {
  const { subjectId } = useParams<{ subjectId: SubjectId }>();

  return (
    <>
      <Link to={`/student/catalog/${subjectId}/${id}`} className={styles.themeWrapper}>
        <p className={styles.themeWrapperNumber}>{number}.</p>
        <p className={styles.themeWrapperTitle}>{name}</p>
      </Link>
    </>
  );
};

export default TaskTheme;
