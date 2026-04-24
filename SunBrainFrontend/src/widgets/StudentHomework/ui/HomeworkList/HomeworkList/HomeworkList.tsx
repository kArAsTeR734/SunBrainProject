import { SubmitButton } from '@features/HomeworkTasks/ui/SubmitHomework/SubmitHomework.tsx';
import './HomeworkList.scss';
import { useHomework } from '@features/HomeworkTasks/model/useHomework.ts';
import { HomeworkCard } from '@entities/Homework';
import { DataFallback } from '@shared/ui';

export const HomeworkList = () => {
  const {
    data: homeworks,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useHomework();

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
    return (
      <DataFallback
        state="empty"
        title="У вас пока нет назначенных домашних заданий."
      />
    );
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
    </div>
  );
};
