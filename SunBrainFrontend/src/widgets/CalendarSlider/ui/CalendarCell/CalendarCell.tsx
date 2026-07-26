import { ReactNode } from 'react';
import './CalendarCell.scss';

export const CalendarCell = ({ children }: { children: ReactNode }) => {
  return <div className="calendar-cell">{children}</div>;
};
