import 'katex/dist/katex.min.css';

import { MarkdownContent } from '@shared/ui';
import { useState } from 'react';

import styles from './TaskSolution.module.scss';

interface TaskSolutionProps {
  solution: string;
}

export const TaskSolution = ({ solution }: TaskSolutionProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const solutionToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.solution}>
      <div className={styles.toggle} onClick={solutionToggle}>
        {isOpen ? 'Скрыть решение' : 'Показать решение'}
      </div>

      {isOpen && <MarkdownContent content={solution} />}
    </div>
  );
};
