import 'katex/dist/katex.min.css';

import { Button } from '@shared/ui';
import { MarkdownContent } from '@shared/ui/markdown-content';
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
      <Button
        className={styles.toggle}
        variant="haveAccount"
        onClick={solutionToggle}
        aria-expanded={isOpen}
      >
        {isOpen ? 'Скрыть решение' : 'Показать решение'}
      </Button>

      {isOpen && (
        <div className={styles.content}>
          <MarkdownContent content={solution} />
        </div>
      )}
    </div>
  );
};
