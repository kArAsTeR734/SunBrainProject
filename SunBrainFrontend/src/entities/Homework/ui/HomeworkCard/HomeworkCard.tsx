import React, { ReactNode } from 'react';
import { HomeworkBase } from '@entities/Homework/model/types.ts';
import './HomeworkCard.scss';
import { formatHomeworksDeadline } from '@entities/Homework/lib/formatDeadline.ts';

interface HomeworkCardProps {
  homework: HomeworkBase;
  action?: ReactNode;
}

export const HomeworkCard: React.FC<HomeworkCardProps> = ({
  homework,
  action,
}) => {
  const deadline = formatHomeworksDeadline(homework.deadline);
  return (
    <div className="homework-card">
      <div className="homework-card__main">
        <div className="homework-card__header">
          <span className="homework-card__subject">{homework.subject}</span>
          <span className="homework-card__type">Домашнее задание</span>
        </div>

        <div className="homework-card__body">
          <h3 className="homework-card__title">{homework.title}</h3>
          <p className="homework-card__deadline">
            <span>Дедлайн:</span> {deadline}
          </p>
        </div>
      </div>
      {action && <div className="homework-card__actions">{action}</div>}
    </div>
  );
};
