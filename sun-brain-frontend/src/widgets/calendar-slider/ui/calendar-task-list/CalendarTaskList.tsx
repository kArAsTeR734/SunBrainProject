import { formatHomeworksDeadline, type HomeworkListItem } from '@entities/homework';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import calendarTaskStyles from './calendarTask.module.scss';
import calendarTaskListStyles from './calendarTaskList.module.scss';

interface CalendarTaskListProps {
  tasks: HomeworkListItem[];
}

const CalendarTask: FC<HomeworkListItem> = ({ id, title, subject, deadline }) => {
  const navigate = useNavigate();

  const handleClickItem = () => {
    navigate(`/student/homework/${id}`);
  };

  return (
    <button onClick={handleClickItem} className={calendarTaskStyles.taskItem} type="button">
      <div className={calendarTaskStyles.taskWrapper}>
        <h4 className={calendarTaskStyles.taskSubject}>{subject}</h4>
        <h3 className={calendarTaskStyles.taskTitle}>Домашнее задание</h3>
        <p className={calendarTaskStyles.taskTheme}>{title}</p>
        <h4 className={calendarTaskStyles.taskDeadline}>
          Дедлайн: {formatHomeworksDeadline(deadline)}
        </h4>
      </div>
    </button>
  );
};

export const CalendarTaskList: FC<CalendarTaskListProps> = ({ tasks }) => {
  if (!tasks.length) return null;

  return (
    <div className={calendarTaskListStyles.tasks}>
      {tasks.map((task) => (
        <CalendarTask key={task.id} {...task} />
      ))}
    </div>
  );
};
