import { SubmitButton, useHomework } from '@features/HomeworkTasks';
import './HomeworkList.scss';
import { HomeworkCard } from '@entities/Homework';
import { DataFallback } from '@shared/ui';
import { useFinishTestMutation } from '@features/Test';

export const HomeworkList = () => {
  const { data: homeworks, isFetching, isLoading, isError, refetch } = useHomework();
  const { isPending } = useFinishTestMutation();
  if (isLoading || isFetching) {
    return (
      <DataFallback
        state="loading"
        title="Список домашних загружается..."
        description="Пожалуйста, подождите немного."
      />
    );
  }

  if (isError) {
    return (
      <DataFallback
        state="error"
        title="Не удалось получить список домашних заданий."
        description="Попробуйте снова через пару секунд."
        onAction={() => void refetch()}
      />
    );
  }

  if (!homeworks?.length) {
    return <DataFallback state="empty" title="У вас пока нет назначенных домашних заданий." />;
  }

  return (
    <div className="homework-list">
      {homeworks.map((homework) => (
        <HomeworkCard
          key={homework.id}
          homework={homework}
          action={<SubmitButton homeworkId={homework.id} />}
        />
      ))}
      {isPending && (
        <DataFallback
          state="loading"
          title="Список сгенерированных домашек после тестирования загружается..."
          description="Пожалуйста, подождите немного."
        />
      )}
    </div>
  );
};
