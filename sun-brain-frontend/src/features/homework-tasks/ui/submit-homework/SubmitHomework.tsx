import { Button } from '@shared/ui';
import { useNavigate } from 'react-router-dom';

import styles from './SubmitHomework.module.scss';

export const SubmitButton = ({ homeworkId }: { homeworkId: number }) => {
  const navigate = useNavigate();
  const handleHomework = () => {
    navigate(`/student/homework/${homeworkId}`);
  };

  return (
    <Button className={styles.submitButton} onClick={handleHomework}>
      Перейти к заданию
    </Button>
  );
};
