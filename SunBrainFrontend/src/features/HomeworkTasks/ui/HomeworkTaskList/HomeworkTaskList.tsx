import './homeworkTaskList.scss';
import { useHomeworkTasks } from '@features/HomeworkTasks/model/useHomeworkTasks.ts';
import { useParams } from 'react-router-dom';
import { DataFallback, TaskItem, TaskList } from '@shared/ui';

export const HomeworkTaskList = () => {
  const { homeworkId } = useParams();
  const {
    data: homework,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useHomeworkTasks(Number(homeworkId));

  if (isLoading || isFetching) {
    return (
      <DataFallback
        state="loading"
        title="Загружаем задания..."
        description="Это может занять пару секунд."
      />
    );
  }

  if (isError) {
    return (
      <DataFallback
        state="error"
        title="Не удалось загрузить задания."
        description="Проверьте соединение и попробуйте снова."
        onAction={() => void refetch()}
      />
    );
  }

  if (!homework?.tasks?.length) {
    return (
      <DataFallback
        state="empty"
        title="По этой домашней работе пока нет заданий."
      />
    );
  }

  return (
    <TaskList>
      {homework.tasks.map((task) => (
        <TaskItem isHomeworkTask={true} key={task.number} task={task} />
      ))}
    </TaskList>
  );
};
