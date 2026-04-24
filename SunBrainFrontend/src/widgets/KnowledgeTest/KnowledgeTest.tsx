import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './KnowledgeTest.scss';
import { KnowledgeTestSubjectId } from '@features/Test/models/types.ts';
import { PATHS } from '@app/providers/routes/config.tsx';
import {
  getKnowledgeTestSubjectById,
  TestNavigation,
  TestResults,
} from '@features/Test';
import { TestTask } from '@/entities/Task';
import { DataFallback } from '@shared/ui';
import { useTestData } from '@features/Test/models/hooks/useTestData.ts';
import { useMySearchParams } from '@shared/hooks/useMySearchParams.ts';
import { useFinishTestMutation } from '@features/Test/models/hooks/useFinishTestMutation.ts';
import { useSubmitTestTaskMutation } from '@features/Test/models/hooks/useSubmitTestTaskMutation.ts';

export const KnowledgeTest = () => {
  const { subjectId } = useParams<{ subjectId: KnowledgeTestSubjectId }>();
  const navigate = useNavigate();

  const { data, isReady } = useTestData();
  const subject = getKnowledgeTestSubjectById(data?.subjectCode ?? 'emath');
  const tasks = data?.tasks ?? [];

  const params = useMySearchParams('testId');
  const testId = Number(params);

  const finishTest = useFinishTestMutation();
  const submitAnswer = useSubmitTestTaskMutation();

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setCurrentTaskIndex(0);
    setUserAnswers({});
    setShowResults(false);
  }, [data?.subjectCode]);

  useEffect(() => {
    if (!data || !subjectId) {
      navigate(PATHS.TEST, { replace: true });
    }
  }, [subjectId, data, navigate]);

  const handleAnswerSubmit = (taskId: number, answer: string) => {
    submitAnswer.mutate({
      testId,
      taskId,
      answer,
    });

    setUserAnswers((prev) => ({
      ...prev,
      [taskId]: answer,
    }));
  };

  const handleTaskSelect = (taskId: number) => {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      setCurrentTaskIndex(taskIndex);
    }
  };

  const handleFinishTest = () => {
    if (!Number.isFinite(testId) || testId <= 0 || finishTest.isPending) {
      return;
    }

    // Показываем результаты сразу, а генерация домашек продолжается в фоне.
    setShowResults(true);
    finishTest.mutate({ testId });
  };

  const handleRestartTest = () => {
    setUserAnswers({});
    setCurrentTaskIndex(0);
    setShowResults(false);
  };

  const handleReviewTask = (taskId: number) => {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      setCurrentTaskIndex(taskIndex);
      setShowResults(false);
    }
  };

  if (!isReady) {
    return (
      <DataFallback
        state="loading"
        title="Загружаем тест..."
        description="Подготавливаем задания и навигацию."
      />
    );
  }

  if (!tasks.length) {
    return (
      <DataFallback
        state="empty"
        title="Тест не содержит заданий."
        description="Выберите другой предмет или запустите тест позже."
        actionLabel="К выбору предмета"
        onAction={() => navigate(PATHS.TEST)}
      />
    );
  }

  const currentTask = tasks[currentTaskIndex];
  const navigationTasks = tasks.map((task) => ({
    id: task.id,
    title: `Задание ${task.id}`,
    isAnswered: userAnswers[task.id] !== undefined,
    isCurrent: task.id === currentTask.id,
    orderIndex: task.orderIndex,
  }));
  const answeredCount = Object.keys(userAnswers).length;

  if (showResults) {
    return (
      <TestResults
        onRestart={handleRestartTest}
        onReview={handleReviewTask}
        isFinishing={finishTest.isPending}
      />
    );
  }

  return (
    <div className="math-test-container">
      <div className="test-header">
        <h1>
          {subject?.examLabel} по предмету {subject?.subjectLabel}
        </h1>
      </div>

      <div className="test-content">
        <div className="task-section">
          <TestTask
            question={currentTask.content}
            key={currentTask.id}
            {...currentTask}
            onAnswerSubmit={handleAnswerSubmit}
          />
        </div>

        <div className="navigation-section">
          <TestNavigation
            tasks={navigationTasks}
            onTaskSelect={handleTaskSelect}
            currentTask={currentTask.orderIndex + 1}
            totalTasks={tasks.length}
            onFinish={handleFinishTest}
            isFinishing={finishTest.isPending}
          />
        </div>
      </div>

      <div className="test-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(answeredCount / tasks.length) * 100}%`,
            }}
          />
        </div>
        <div className="progress-text">
          Выполнено: {answeredCount} из {tasks.length} заданий
        </div>
      </div>
    </div>
  );
};

export default KnowledgeTest;
