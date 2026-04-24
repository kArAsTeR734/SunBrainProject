import React from 'react';
import {} from '../../../../api/types/ai-types.ts';
import { Task } from '@entities/Task/model/types.ts';

interface AITaskGeneratorProps {
  userId?: string;
  initialTopic?: string;
  onTaskGenerated?: (_task: Task) => void;
  className?: string;
}

const AITaskGenerator: React.FC<AITaskGeneratorProps> = ({
  className = '',
}) => {
  return (
    <div className={`ai-task-generator ${className}`}>
      <h3>Генератор заданий с ИИ</h3>

      <div className="generator-controls">
        <div className="form-group">
          <label htmlFor="topic-input">Тема задания:</label>
          <input
            id="topic-input"
            type="text"
            placeholder="Например: производные, интегралы, уравнения"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="difficulty-select">Сложность:</label>
          <select id="difficulty-select" className="form-control">
            <option value="easy">Легкая</option>
            <option value="medium">Средняя</option>
            <option value="hard">Сложная</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="level-input">Уровень ученика (опционально):</label>
          <input id="level-input" type="text" className="form-control" />
        </div>

        <div className="button-group">
          <button className="btn btn-primary generate-btn"></button>

          <button className="btn btn-secondary clear-btn">Очистить</button>
        </div>
      </div>
    </div>
  );
};

export default AITaskGenerator;
