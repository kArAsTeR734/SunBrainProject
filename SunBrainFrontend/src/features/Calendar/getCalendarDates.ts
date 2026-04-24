import { DataTime } from '@features/Calendar/types.ts';

export default function getCalendarDates() {
  const dates: DataTime[] = [];
  const today = new Date();

  const daysCount = 14;

  for (let i = 0; i < daysCount; i++) {
    const currentDay = new Date(today);

    currentDay.setDate(today.getDate() + i);

    const dateLabel = currentDay
      .toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      })
      .replace('.', '');

    const weekDay = currentDay.toLocaleDateString('ru-RU', {
      weekday: 'long',
    });

    dates.push({
      date: dateLabel,
      weekDay: weekDay,
    });
  }

  return dates;
}
