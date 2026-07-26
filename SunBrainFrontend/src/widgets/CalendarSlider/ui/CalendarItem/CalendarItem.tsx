import './calendarItem.scss';
import { FC } from 'react';
import type { DataTime } from '@features/Calendar';

export interface CalendarItemProps {
  dataTime: DataTime;
}

export const CalendarItem: FC<CalendarItemProps> = ({ dataTime }) => {
  return (
    <div className="calendar__item">
      <div className="calendar__date">{dataTime.date}</div>
      <div className="calendar__day">{dataTime.weekDay}</div>
    </div>
  );
};
