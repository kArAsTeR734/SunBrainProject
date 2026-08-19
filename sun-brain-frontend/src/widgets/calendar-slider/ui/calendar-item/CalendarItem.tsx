import type { DataTime } from '@features/calendar';
import { FC } from 'react';

import styles from './calendarItem.module.scss';

export interface CalendarItemProps {
  dataTime: DataTime;
}

export const CalendarItem: FC<CalendarItemProps> = ({ dataTime }) => {
  return (
    <div className={styles.item}>
      <div className={styles.date}>{dataTime.date}</div>
      <div className={styles.day}>{dataTime.weekDay}</div>
    </div>
  );
};
