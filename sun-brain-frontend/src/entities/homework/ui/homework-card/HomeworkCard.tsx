import React, { ReactNode } from 'react';

import { formatHomeworksDeadline } from '../../lib/formatDeadline';
import type { HomeworkBase } from '../../model/types';
import styles from './HomeworkCard.module.scss';

interface HomeworkCardProps {
  homework: HomeworkBase;
  action?: ReactNode;
}

export const HomeworkCard: React.FC<HomeworkCardProps> = ({ homework, action }) => {
  const deadline = formatHomeworksDeadline(homework.deadline);
  return (
    <div className={styles.homeworkCard}>
      <div className={styles.main}>
        <div className={styles.header}>
          <span className={styles.subject}>{homework.subject}</span>
          <span className={styles.type}>Домашнее задание</span>
        </div>

        <div className={styles.body}>
          <h3 className={styles.title}>{homework.title}</h3>
          <p className={styles.deadline}>
            <span>Дедлайн:</span> {deadline}
          </p>
        </div>
      </div>
      {action && <div className={styles.actions}>{action}</div>}
    </div>
  );
};
