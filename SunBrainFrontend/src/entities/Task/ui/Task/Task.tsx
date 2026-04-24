import React, { useState } from 'react';
import './Task.scss';
import { MarkdownContent } from '@features/HomeworkTasks';

interface TaskProps {
  id: number;
  question: string;
  onAnswerSubmit: (_id: number, _answer: string) => void;
}

export const TestTask: React.FC<TaskProps> = ({
  id,
  question,
  onAnswerSubmit,
}) => {
  const [textAnswer, setTextAnswer] = useState<string>('');

  const handleTextSubmit = () => {
    onAnswerSubmit(id, textAnswer);
  };

  const renderQuestionType = () => {
    return (
      <div className="text-input-container">
        <textarea
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          className="text-input"
          placeholder="Введите ответ"
          rows={3}
        />
        <button onClick={handleTextSubmit} className="submit-button">
          Подтвердить
        </button>
      </div>
    );
  };

  return (
    <div className="task-container">
      <div className="task-header">
        <h3>Задание №{id}</h3>
      </div>

      <div className="task-content">
        <MarkdownContent content={question} />

        {renderQuestionType()}
      </div>
    </div>
  );
};
