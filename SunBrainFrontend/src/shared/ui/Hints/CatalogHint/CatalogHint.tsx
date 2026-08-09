import FormulaHint from '@shared/assets/formulaHint.svg?react';
import TaskHint from '@shared/assets/taskHint.svg?react';
import { ReactNode } from 'react';

import styles from './catalogHint.module.scss';

interface Hint {
  number: number;
  image: ReactNode;
  title: string;
}

const catalogHints: Hint[] = [
  {
    number: 1,
    image: <FormulaHint />,
    title: 'Вспоминай формулы по каждой теме',
  },
  {
    number: 2,
    image: <TaskHint />,
    title: 'Решай новые задачи каждый день',
  },
];

const CatalogHint = () => {
  return (
    <>
      {catalogHints.map(({ number, image, title }) => (
        <div className={styles.catalogHint} key={number}>
          <div className={styles.img}>
            {image}
            <span className={styles.number}>{number}</span>
          </div>
          <div className={styles.title}>{title}</div>
        </div>
      ))}
    </>
  );
};

export default CatalogHint;
