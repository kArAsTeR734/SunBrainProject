import { useNavigate, useParams } from 'react-router-dom';
import { useCatalogTasks } from '@features/Catalog';
import { DataFallback, TaskItem, TaskList } from '@shared/ui';

export const CatalogTaskList = () => {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const {
    data: catalogTasks,
    isLoading,
    isError,
    refetch,
  } = useCatalogTasks(Number(themeId));
  console.log(catalogTasks);
  if (isLoading) {
    return (
      <DataFallback state="loading" title="Загружаем задания по теме..." />
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

  if (!catalogTasks?.length) {
    return (
      <DataFallback
        state="empty"
        title="Заданий по этой теме пока нет."
        actionLabel="Назад"
        onAction={() => navigate(-1)}
      />
    );
  }

  return (
    <TaskList>
      {catalogTasks.map((task) => (
        <TaskItem isHomeworkTask={false} key={task.id} task={task} />
      ))}
    </TaskList>
  );
};
