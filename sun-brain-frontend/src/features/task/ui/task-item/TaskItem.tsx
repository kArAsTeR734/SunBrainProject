import type { CatalogTask, HomeworkTask } from '@entities/task';
import { useInput } from '@shared/lib';
import { Button } from '@shared/ui';
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
        <h4 className={styles.number}>{task.id}</h4>
        <span className={styles.attempts}>
          Попыток до показа решения осталось: {attemptCount}
        </span>
      </div>
      <div className={styles.text}>
        <MarkdownContent content={taskContent} />
      </div>
      <div className={styles.actions}>
        <div className={styles.answer}>
          <input
            className={clsx(styles.answerField, {
              [styles.correct]: isChecked && isTaskComplete,
              [styles.invalid]: isChecked && !isTaskComplete,
            })}
            type="text"
            id="aswer-field"
            placeholder="Ответ"
            value={answer.value}
            onChange={handleAnswerChange}
          />
        </div>
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
