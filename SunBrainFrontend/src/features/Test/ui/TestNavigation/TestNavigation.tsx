import React from 'react';
import './TestNavigation.scss';
import { TestTask } from '@/models/TestTask.ts';

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
  const prevTaskId =
    currentTaskListIndex > 0 ? tasks[currentTaskListIndex - 1].id : null;
  const nextTaskId =
    currentTaskListIndex >= 0 && currentTaskListIndex < tasks.length - 1
      ? tasks[currentTaskListIndex + 1].id
      : null;

  return (
    <div className="navigation-container">
      <div className="navigation-header">
        <h3>Навигация по заданиям</h3>
        <div className="progress-info">
          Задание {currentTask} из {totalTasks}
        </div>
      </div>

      <div className="tasks-grid">
        {tasks.map((task) => (
          <button
            key={task.id}
            className={`task-button ${task.isCurrent ? 'current' : ''} ${
              task.isAnswered ? 'answered' : 'unanswered'
            }`}
            onClick={() => onTaskSelect(task.id)}
          >
            {task.orderIndex + 1}
          </button>
        ))}
      </div>

      <div className="navigation-footer">
        <button
          className="prev-button"
          onClick={() => prevTaskId !== null && onTaskSelect(prevTaskId)}
          disabled={prevTaskId === null}
        >
          Назад
        </button>

        <button
          className="next-button"
          onClick={() => nextTaskId !== null && onTaskSelect(nextTaskId)}
          disabled={nextTaskId === null}
        >
          Вперёд
        </button>

        <button
          className="finish-button"
          onClick={onFinish}
          disabled={isFinishing}
        >
          {isFinishing ? 'Завершение...' : 'Завершить тест'}
        </button>
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="legend-dot answered"></span>
          <span>Отвечено</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot unanswered"></span>
          <span>Не отвечено</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot current"></span>
          <span>Текущее</span>
        </div>
      </div>
    </div>
  );
};
