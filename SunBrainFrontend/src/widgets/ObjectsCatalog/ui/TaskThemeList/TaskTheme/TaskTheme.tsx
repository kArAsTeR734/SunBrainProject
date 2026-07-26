import './taskTheme.scss';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { SubjectId } from '../../../model/Subject';
import type { Topic } from '@features/Topics';

const TaskTheme: FC<Topic> = ({ name, id, number }: Topic) => {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: SubjectId }>();
  const handleClick = () => {
    navigate(`/student/catalog/${subjectId}/${id}`);
  };
  return (
    <>
      <div className="theme-wrapper" onClick={handleClick}>
        <p className="theme-wrapper-number">{number}.</p>
        <p className="theme-wrapper-title">{name}</p>
      </div>
    </>
  );
};

export default TaskTheme;
