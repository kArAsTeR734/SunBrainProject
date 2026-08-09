import type { Topic } from '@features/Topics';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { SubjectId } from '../../../model/Subject';
import styles from './taskTheme.module.scss';

const TaskTheme: FC<Topic> = ({ name, id, number }: Topic) => {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: SubjectId }>();
  const handleClick = () => {
    navigate(`/student/catalog/${subjectId}/${id}`);
  };
  return (
    <>
      <div className={styles.themeWrapper} onClick={handleClick}>
        <p className={styles.themeWrapperNumber}>{number}.</p>
        <p className={styles.themeWrapperTitle}>{name}</p>
      </div>
    </>
  );
};

export default TaskTheme;
