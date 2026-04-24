import './taskThemeList.scss';
import TaskTheme from '@/widgets/ObjectsCatalog/TaskThemeList/TaskTheme/TaskTheme.tsx';
import { useParams } from 'react-router-dom';
import { SubjectId } from '@/models/Subject.ts';
import getSubjectTitle from '@shared/utils/getSubjectTitle.ts';
import { useTopics } from '@features/Topics/models/hooks/useTopics.ts';
import { DataFallback } from '@shared/ui';

export const TaskThemeList = () => {
  const { subjectId } = useParams<{ subjectId: SubjectId }>();
  const {
    data: themes,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useTopics(subjectId ?? '');
  if (!subjectId) {
    return (
      <DataFallback
        state="empty"
        title="Предмет не выбран."
        description="Вернитесь назад и выберите предмет для просмотра тем."
      />
    );
  }

  if (isLoading || isFetching) {
    return (
      <DataFallback
        state="loading"
        title="Загружаем темы..."
        description="Это займет пару секунд."
      />
    );
  }

  if (isError) {
    return (
      <DataFallback
        state="error"
        title="Не удалось получить список тем."
        description="Проверьте соединение и попробуйте снова."
        onAction={() => void refetch()}
      />
    );
  }

  if (!themes?.length) {
    return (
      <DataFallback state="empty" title="Для этого предмета пока нет тем." />
    );
  }

  return (
    <section className="themes">
      <div className="themes__about">
        <h2 className="themes__header">
          Задания по предмету:{' '}
          <span className="highlight">{getSubjectTitle(subjectId)}</span>
        </h2>
        <p className="themes__description">
          Задания в каталоге предназначены для самостоятельного решения,
          просмотр решения в данном разделе{' '}
          <span className="highlight">не предусмотрен</span>. Функция
          самопроверки <span className="highlight">доступна</span>.
        </p>
      </div>

      <div className="themes__list">
        {themes.map((theme) => (
          <TaskTheme key={theme.id} {...theme} />
        ))}
      </div>
    </section>
  );
};
