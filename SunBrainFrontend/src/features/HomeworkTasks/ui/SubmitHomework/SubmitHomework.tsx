import { useNavigate } from 'react-router-dom';

import styles from './SubmitHomework.module.scss';

export const SubmitButton = ({ homeworkId }: { homeworkId: number }) => {
  const navigate = useNavigate();
  const handleHomework = () => {
    navigate(`/student/homework/${homeworkId}`);
  };

  return (
    <button className={styles.submitButton} onClick={handleHomework}>
      Перейти к заданию
    </button>
  );
};
