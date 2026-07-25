import React, { FC, useState } from 'react';
import useInput from '@shared/hooks/useInput.ts';
import { MarkdownContent } from '@features/HomeworkTasks/ui/HomeworkContent/HomeworkContent.tsx';
import { TaskSolution } from '@features/HomeworkTasks/ui/TaskSolution/TaskSolution.tsx';
import clsx from 'clsx';
import './TaskItem.scss';
import { Button } from '@shared/ui/Button/Button.tsx';
import { useCheckTask } from '@features/Task';
import { CatalogTask, HomeworkTask } from '@entities/Task/model/types.ts';

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
    <>
      <div className="task">
        <div className="task__header">
          <h4>
            <span className="task__number">Задача {task.id}</span>
          </h4>
          <span className="task__attempts">Попыток до показа решения осталось: {attemptCount}</span>
        </div>
        <div className="task__text">
          <MarkdownContent content={taskContent} />
        </div>
        <div className="task__actions">
          <div className="task__answer">
            <input
              className={clsx('task__answer-field', {
                'task__answer-field--correct': isChecked && isTaskComplete,
                'task__answer-field--invalid': isChecked && !isTaskComplete,
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
            className="task__check"
            disabled={checkAnswerMutate.isPending}
          >
            {checkAnswerMutate.isPending ? 'Проверка...' : 'Проверить'}
          </Button>
        </div>

        {(attemptCount === 0 || (isChecked && isTaskComplete)) && (
          <TaskSolution solution={task.solutionLatex} />
        )}
      </div>
    </>
  );
};
