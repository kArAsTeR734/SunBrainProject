import { ReactNode } from 'react';

import styles from './CalendarCell.module.scss';

export const CalendarCell = ({ children }: { children: ReactNode }) => {
  return <div className={styles.calendarCell}>{children}</div>;
};
