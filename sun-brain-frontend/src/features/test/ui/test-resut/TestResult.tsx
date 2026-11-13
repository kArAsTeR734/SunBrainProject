import { useMySearchParams } from '@shared/lib';
import { Button, DataFallback } from '@shared/ui';

import { useTestReview } from '../../api/useTestReview.ts';
import styles from './TestResult.module.scss';

interface TestResultsProps {
  onRestart: () => void;
  onReview: (_taskId: number) => void;
  isFinishing?: boolean;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Легкий',
  medium: 'Средний',
  hard: 'Сложный',
};

const stringifyAnswer = (answer: string | null) => {
  if (!answer || !answer.trim()) {
    return 'Нет ответа';
  }

  return answer;
};

export const TestResults = ({
  onRestart,
  onReview,
  isFinishing = false,
}: TestResultsProps) => {
  const queryTestId = useMySearchParams('testId');
  const testId = Number(queryTestId);
  const isValidTestId = Number.isFinite(testId) && testId > 0;
  const {
    data: reviewData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useTestReview(testId);

  if (!isValidTestId) {
    return (
      <DataFallback
        state="error"
        title="Не удалось открыть результаты теста."
        description="Отсутствует корректный идентификатор теста."
        actionLabel="Пройти заново"
        onAction={onRestart}
      />
    );
  }

  if (isLoading || isFetching) {
    return (
      <DataFallback
        state="loading"
        title={
          isFinishing
            ? 'Завершаем тест и считаем результаты...'
            : 'Загружаем результаты...'
        }
        description="Обычно это занимает несколько секунд."
      />
    );
  }

  if (isError) {
    return (
      <DataFallback
        state="error"
        title="Не удалось загрузить результаты теста."
        description="Можно повторить запрос."
        onAction={() => void refetch()}
      />
    );
  }

  if (!reviewData || !reviewData.answers?.length) {
    return (
      <DataFallback
        state="empty"
        title="Результаты пока не готовы."
        description="Попробуйте открыть экран позже или перезапустите тест."
        actionLabel="Пройти заново"
        onAction={onRestart}
      />
    );
  }

  const answers = [...reviewData.answers].sort((a, b) => a.orderIndex - b.orderIndex);
  const totalTasks = reviewData.totalTasks || answers.length;
  const correctTasks = reviewData.correctTasks;
  const incorrectTasks = totalTasks - correctTasks;
  const scorePercent = totalTasks > 0 ? Math.round((correctTasks / totalTasks) * 100) : 0;

  return (
    <section className={styles.resultsContainer}>
      <div className={styles.resultsHeader}>
        <h2>Результаты теста</h2>
        <div className={styles.scoreCard}>
          <span className={styles.scorePercentage}>{scorePercent}%</span>
          <span className={styles.scoreDetails}>
            {correctTasks} из {totalTasks} верно
          </span>
        </div>
      </div>

      <div className={styles.resultsSummary}>
        <div className={`${styles.summaryItem} ${styles.correct}`}>
          <span className={styles.summaryCount}>{correctTasks}</span>
          <span className={styles.summaryLabel}>Верных ответов</span>
        </div>
        <div className={`${styles.summaryItem} ${styles.incorrect}`}>
          <span className={styles.summaryCount}>{incorrectTasks}</span>
          <span className={styles.summaryLabel}>Ошибок</span>
        </div>
      </div>

      <div className={styles.answersDetails}>
        <h3>Разбор по заданиям</h3>
        <div className={styles.answersList}>
          {answers.map((answer) => (
            <button
              className={`${styles.answerItem} ${
                answer.isCorrect ? styles.correct : styles.incorrect
              }`}
              key={answer.taskId}
              onClick={() => onReview(answer.taskId)}
              type="button"
            >
              <span className={styles.answerTaskId}>№ {answer.taskNumber}</span>
              <div className={styles.answerComparison}>
                <p className={styles.userAnswer}>
                  Ваш ответ: <strong>{stringifyAnswer(answer.userAnswer)}</strong>
                </p>
                {!answer.isCorrect && (
                  <p className={styles.correctAnswer}>
                    Правильный ответ: <strong>{answer.correctAnswer}</strong>
                  </p>
                )}
                <p className={styles.correctAnswer}>
                  Сложность:{' '}
                  <strong>
                    {DIFFICULTY_LABELS[answer.difficulty] ?? answer.difficulty}
                  </strong>
                </p>
              </div>
              <span className={styles.answerStatus}>
                {answer.isCorrect ? 'Верно' : 'Ошибка'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.resultsActions}>
        <Button className={styles.restartButton} onClick={onRestart}>
          Пройти тест заново
        </Button>
      </div>
    </section>
  );
};
