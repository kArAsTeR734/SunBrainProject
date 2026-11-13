import { Button } from '@shared/ui';
import { MarkdownContent } from '@shared/ui/markdown-content';
import React, { useState } from 'react';

import styles from './TestTask.module.scss';

interface TaskProps {
  id: number;
  question: string;
  onAnswerSubmit: (_id: number, _answer: string) => void;
}

export const TestTask: React.FC<TaskProps> = ({ id, question, onAnswerSubmit }) => {
  const [textAnswer, setTextAnswer] = useState<string>('');

  const handleTextSubmit = () => {
    onAnswerSubmit(id, textAnswer);
  };

  const renderQuestionType = () => {
    return (
      <div className={styles.textInputContainer}>
        <textarea
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          className={styles.textInput}
          placeholder="Введите ответ"
          aria-label="Ваш ответ"
          rows={3}
        />
        <Button onClick={handleTextSubmit} className={styles.submitButton}>
          Подтвердить
        </Button>
      </div>
    );
  };

  return (
    <div className={styles.taskContainer}>
      <div className={styles.taskHeader}>
        <h3>Задание №{id}</h3>
      </div>

      <div className={styles.taskContent}>
        <MarkdownContent content={question} />

        {renderQuestionType()}
      </div>
    </div>
  );
};
