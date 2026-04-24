import './TestResult.scss';
import { useTestReview } from '@features/Test/models/hooks/useTestReview.ts';
import { useMySearchParams } from '@shared/hooks/useMySearchParams.ts';
import { DataFallback } from '@shared/ui';

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

  const answers = [...reviewData.answers].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );
  const totalTasks = reviewData.totalTasks || answers.length;
  const correctTasks = reviewData.correctTasks;
  const incorrectTasks = totalTasks - correctTasks;
  const scorePercent =
    totalTasks > 0 ? Math.round((correctTasks / totalTasks) * 100) : 0;

  return (
    <section className="results-container">
      <div className="results-header">
        <h2>Результаты теста</h2>
        <div className="score-card">
          <span className="score-percentage">{scorePercent}%</span>
          <span className="score-details">
            {correctTasks} из {totalTasks} верно
          </span>
        </div>
      </div>

      <div className="results-summary">
        <div className="summary-item correct">
          <span className="summary-count">{correctTasks}</span>
          <span className="summary-label">Верных ответов</span>
        </div>
        <div className="summary-item incorrect">
          <span className="summary-count">{incorrectTasks}</span>
          <span className="summary-label">Ошибок</span>
        </div>
      </div>

      <div className="answers-details">
        <h3>Разбор по заданиям</h3>
        <div className="answers-list">
          {answers.map((answer) => (
            <button
              className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}
              key={answer.taskId}
              onClick={() => onReview(answer.taskId)}
              type="button"
            >
              <span className="answer-task-id">№ {answer.taskNumber}</span>
              <div className="answer-comparison">
                <p className="user-answer">
                  Ваш ответ:{' '}
                  <strong>{stringifyAnswer(answer.userAnswer)}</strong>
                </p>
                {!answer.isCorrect && (
                  <p className="correct-answer">
                    Правильный ответ: <strong>{answer.correctAnswer}</strong>
                  </p>
                )}
                <p className="correct-answer">
                  Сложность:{' '}
                  <strong>
                    {DIFFICULTY_LABELS[answer.difficulty] ?? answer.difficulty}
                  </strong>
                </p>
              </div>
              <span className="answer-status">
                {answer.isCorrect ? 'Верно' : 'Ошибка'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="results-actions">
        <button className="restart-button" onClick={onRestart} type="button">
          Пройти тест заново
        </button>
      </div>
    </section>
  );
};
