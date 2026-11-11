import { useCatalogTasks } from '@features/catalog';
import { TaskItem, TaskList } from '@features/task';
import { Button, DataFallback } from '@shared/ui';
import { useNavigate, useParams } from 'react-router-dom';

export const CatalogTaskList = () => {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    isLoading,
    isError,
    refetch,
  } = useCatalogTasks(Number(themeId));
  const catalogTasks = data?.pages.flatMap((page) => page.catalogTasks) ?? [];

  if (isLoading) {
    return (
      <DataFallback
        state="loading"
        title="Загружаем задания по теме..."
      />
    );
  }

  if (isError && !catalogTasks.length) {
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
    <>
      <TaskList>
        {catalogTasks.map((task) => (
          <TaskItem isHomeworkTask={false} key={task.id} task={task} />
        ))}
      </TaskList>
      {isFetchNextPageError && (
        <p role="alert">Не удалось загрузить следующие задания. Попробуйте ещё раз.</p>
      )}
      {hasNextPage && (
        <Button disabled={isFetching} onClick={() => void fetchNextPage()}>
          {isFetchingNextPage
            ? 'Загружаем…'
            : isFetchNextPageError
              ? 'Повторить загрузку'
              : 'Показать ещё'}
        </Button>
      )}
      <p role="status">Загружено заданий: {catalogTasks.length}</p>
    </>
  );
};
