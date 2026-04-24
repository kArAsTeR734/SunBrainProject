import './SubmitHomework.scss';
import { useNavigate } from 'react-router-dom';

export const SubmitButton = ({ homeworkId }: { homeworkId: number }) => {
  const navigate = useNavigate();
  const handleHomework = () => {
    navigate(`/student/homework/${homeworkId}`);
  };

  return (
    <button className="submit-button" onClick={handleHomework}>
      Перейти к заданию
    </button>
  );
};
