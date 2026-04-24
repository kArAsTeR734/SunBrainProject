import './calendarTaskList.scss';
import './calendarTask.scss';
import { FC } from 'react';
import { HomeworkListItem } from '@entities/Homework/model/types.ts';
import { formatHomeworksDeadline } from '@entities/Homework/lib/formatDeadline.ts';
import { useNavigate } from 'react-router-dom';

interface CalendarTaskListProps {
  tasks: HomeworkListItem[];
}

const CalendarTask: FC<HomeworkListItem> = ({
  id,
  title,
  subject,
  deadline,
}) => {
  const navigate = useNavigate();

  const handleClickItem = () => {
    navigate(`/student/homework/${id}`);
  };

  return (
    <button
      onClick={handleClickItem}
      className="calendar__task-item"
      type="button"
    >
      <div className="calendar__task-wrapper">
        <h4 className="calendar__task-subject">{subject}</h4>
        <h3 className="calendar__task-title">Домашнее задание</h3>
        <p className="calendar__task-theme">{title}</p>
        <h4 className="calendar__task-deadline">
          Дедлайн: {formatHomeworksDeadline(deadline)}
        </h4>
      </div>
    </button>
  );
};

export const CalendarTaskList: FC<CalendarTaskListProps> = ({ tasks }) => {
  if (!tasks.length) return null;

  return (
    <div className="calendar__tasks">
      {tasks.map((task) => (
        <CalendarTask key={task.id} {...task} />
      ))}
    </div>
  );
};
