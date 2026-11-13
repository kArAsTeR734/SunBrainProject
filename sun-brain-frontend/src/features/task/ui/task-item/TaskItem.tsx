import type { CatalogTask, HomeworkTask } from '@entities/task';
import { useInput } from '@shared/lib';
import { Button, Input } from '@shared/ui';
import { MarkdownContent } from '@shared/ui/markdown-content';
import clsx from 'clsx';
import React, { FC, useState } from 'react';

import { useCheckTask } from '../../api/useCheckTask.ts';
import { TaskSolution } from '../task-solution/TaskSolution';
import styles from './TaskItem.module.scss';

interface TaskItemProps {
  isHomeworkTask: boolean;
  task: HomeworkTask | CatalogTask;
}

export const TaskItem: FC<TaskItemProps> = ({ task, isHomeworkTask }) => {
  const answer = useInput('');
  const [isChecked, setIsChecked] = useState(false);
  const [isTaskComplete, setIsTaskComplete] = useState(false);
  const [attemptCount, setAttemptCount] = useState<number>(3);
  const checkAnswerMutate = useCheckTask(task.id);
  const taskContent = isHomeworkTask
    ? (task as HomeworkTask).question
    : (task as CatalogTask).content;

  const checkAnswerCorrect = async () => {
    try {
      const data = await checkAnswerMutate.mutateAsync({
        answer: answer.value,
      });
      const isCorrect = data.correct;

      setIsChecked(true);
      setIsTaskComplete(isCorrect);

      if (!isCorrect) {
        setAttemptCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error('Ошибка проверки задания', error);
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    answer.onChange(e);
    setIsChecked(false);
  };

  if (!task) {
    return null;
  }

  return (
    <div className={styles.task}>
      <div className={styles.header}>
        <h4 className={styles.number}>Задание {task.id}</h4>
        <span className={styles.attempts}>
          Попыток до показа решения осталось: {attemptCount}
        </span>
      </div>
      <div className={styles.text}>
        <MarkdownContent content={taskContent} />
      </div>
      <div className={styles.actions}>
        <Input
          className={clsx(styles.answer, {
            [styles.correct]: isChecked && isTaskComplete,
            [styles.invalid]: isChecked && !isTaskComplete,
          })}
          type="text"
          id={`answer-${task.id}`}
          label="Ваш ответ"
          placeholder="Введите ответ"
          value={answer.value}
          onChange={handleAnswerChange}
        />
        <Button
          onClick={checkAnswerCorrect}
          className={styles.check}
          disabled={checkAnswerMutate.isPending}
        >
          {checkAnswerMutate.isPending ? 'Проверка...' : 'Проверить'}
        </Button>
      </div>

      {(attemptCount === 0 || (isChecked && isTaskComplete)) && (
        <TaskSolution solution={task.solutionLatex} />
      )}
    </div>
  );
};
