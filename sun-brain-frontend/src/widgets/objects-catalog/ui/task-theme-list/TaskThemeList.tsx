import { getSubjectTitle } from '@entities/catalog';
import { useTopics } from '@entities/topic';
import { DataFallback, Loader } from '@shared/ui';
import { useParams } from 'react-router-dom';

import type { SubjectId } from '../../model/Subject';
import TaskTheme from './task-theme/TaskTheme.tsx';
import styles from './taskThemeList.module.scss';

export const TaskThemeList = () => {
  const { subjectId } = useParams<{ subjectId: SubjectId }>();
  const {
    data: themes,
    isLoading,
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

  if (isLoading) {
    return <Loader />;
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
    return <DataFallback state="empty" title="Для этого предмета пока нет тем." />;
  }

  return (
    <section className={styles.themes}>
      <div className={styles.about}>
        <h2 className={styles.header}>
          Задания по предмету:{' '}
          <span className={styles.highlight}>{getSubjectTitle(subjectId)}</span>
        </h2>
        <p className={styles.description}>
          Задания в каталоге предназначены для самостоятельного решения, просмотр решения
          в данном разделе <span className={styles.highlight}>не предусмотрен</span>. Функция
          самопроверки <span className={styles.highlight}>доступна</span>.
        </p>
      </div>

      <div className={styles.list}>
        {themes.map((theme) => (
          <TaskTheme key={theme.id} {...theme} />
        ))}
      </div>
    </section>
  );
};
