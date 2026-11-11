import React from 'react';

import type { TestTask } from '../../models/TestTask';
import styles from './TestNavigation.module.scss';

interface TaskNavigationProps {
  tasks: Array<TestTask>;
  onTaskSelect: (_id: number) => void;
  currentTask: number;
  totalTasks: number;
  onFinish: () => void;
  isFinishing?: boolean;
}

export const TestNavigation: React.FC<TaskNavigationProps> = ({
  tasks,
  onTaskSelect,
  currentTask,
  totalTasks,
  onFinish,
  isFinishing = false,
}) => {
  const currentTaskListIndex = tasks.findIndex((task) => task.isCurrent);
  const prevTaskId = currentTaskListIndex > 0 ? tasks[currentTaskListIndex - 1].id : null;
  const nextTaskId =
    currentTaskListIndex >= 0 && currentTaskListIndex < tasks.length - 1
      ? tasks[currentTaskListIndex + 1].id
      : null;

  return (
    <div className={styles.navigationContainer}>
      <div className={styles.navigationHeader}>
        <h3>Навигация по заданиям</h3>
        <div className={styles.progressInfo}>
          Задание {currentTask} из {totalTasks}
        </div>
      </div>

      <div className={styles.tasksGrid}>
        {tasks.map((task) => (
          <button
            key={task.id}
            aria-current={task.isCurrent ? 'step' : undefined}
            aria-label={`Задание ${task.orderIndex + 1}, ${task.isAnswered ? 'отвечено' : 'без ответа'}`}
            className={`${styles.taskButton} ${task.isCurrent ? styles.current : ''} ${
              task.isAnswered ? styles.answered : styles.unanswered
            }`}
            onClick={() => onTaskSelect(task.id)}
          >
            {task.orderIndex + 1}
          </button>
        ))}
      </div>

      <div className={styles.navigationFooter}>
        <button
          className={styles.prevButton}
          onClick={() => prevTaskId !== null && onTaskSelect(prevTaskId)}
          disabled={prevTaskId === null}
        >
          Назад
        </button>

        <button
          className={styles.nextButton}
          onClick={() => nextTaskId !== null && onTaskSelect(nextTaskId)}
          disabled={nextTaskId === null}
        >
          Вперёд
        </button>

        <button className={styles.finishButton} onClick={onFinish} disabled={isFinishing}>
          {isFinishing ? 'Завершение...' : 'Завершить тест'}
        </button>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.answered}`}></span>
          <span>Отвечено</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.unanswered}`}></span>
          <span>Не отвечено</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.current}`}></span>
          <span>Текущее</span>
        </div>
      </div>
    </div>
  );
};
