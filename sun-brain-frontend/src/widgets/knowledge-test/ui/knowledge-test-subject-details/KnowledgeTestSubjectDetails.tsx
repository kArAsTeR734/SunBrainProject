import {
  getKnowledgeTestSubjectById,
  type KnowledgeTestSubjectId,
  useGetKnowledgeTestTotalTaskCount,
  useStartTestMutation,
} from '@features/test';
import { PATHS } from '@shared/routes';
import { Button, DataFallback } from '@shared/ui';
import { Link, useParams } from 'react-router-dom';

import styles from './KnowledgeTestSubjectDetails.module.scss';

export const KnowledgeTestSubjectDetails = () => {
  const { subjectId } = useParams<{ subjectId: KnowledgeTestSubjectId }>();
  const subject = getKnowledgeTestSubjectById(subjectId ?? 'emath');

  const {
    data: totalTasks,
    isLoading,
    isError,
    refetch,
  } = useGetKnowledgeTestTotalTaskCount(subject?.id);
  const startTestMutation = useStartTestMutation();

  const handleStartTest = () => {
    if (!subjectId) return;
    startTestMutation.mutate(subjectId);
  };

  if (isError) {
    return (
      <DataFallback
        state="error"
        title="Не удалось получить параметры теста."
        description="Попробуйте запросить данные ещё раз."
        onAction={() => void refetch()}
      />
    );
  }

  return (
    <section className={styles.knowledgeTestDetails}>
      <h1 className={styles.title}>{subject?.title}</h1>

      <div className={styles.card}>
        <div className={styles.row}>
          <span>Формат экзамена</span>
          <strong>{subject?.examLabel}</strong>
        </div>
        <div className={styles.row}>
          <span>Номеров в экзамене</span>
          <strong>{subject?.examTaskCount}</strong>
        </div>
        <div className={styles.row}>
          <span>Заданий на каждый номер</span>
          <strong>1-2 уровня сложности</strong>
        </div>
        <div className={styles.row}>
          <span>Итого заданий</span>
          <strong>{isLoading ? 'Загрузка...' : (totalTasks ?? '—')}</strong>
        </div>
      </div>

      {!isLoading && totalTasks === 0 && (
        <p>Для этого предмета пока нет заданий для тестирования.</p>
      )}

      <div className={styles.actions}>
        <Link className={`${styles.action} ${styles.secondary}`} to={PATHS.TEST}>
          Назад к выбору предмета
        </Link>
        <Button
          className={styles.action}
          onClick={handleStartTest}
          disabled={startTestMutation.isPending || isLoading || totalTasks === 0}
        >
          {startTestMutation.isPending ? 'Запускаем тест...' : 'Начать тестирование'}
        </Button>
      </div>
    </section>
  );
};
