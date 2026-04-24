import { useState } from 'react';
import 'katex/dist/katex.min.css';
import './TaskSolution.scss';
import { MarkdownContent } from '@features/HomeworkTasks';

interface TaskSolutionProps {
  solution: string;
}

export const TaskSolution = ({ solution }: TaskSolutionProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const solutionToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="solution">
      <div className="solution__toggle" onClick={solutionToggle}>
        {isOpen ? 'Скрыть решение' : 'Показать решение'}
      </div>

      {isOpen && <MarkdownContent content={solution} />}
    </div>
  );
};
