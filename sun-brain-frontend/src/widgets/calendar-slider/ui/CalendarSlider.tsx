import { getCalendarDates } from '@features/calendar';
import { groupHomeworksByDate, useHomework } from '@features/homework-tasks';
import { DataFallback } from '@shared/ui';

import { CalendarCell } from './calendar-cell/CalendarCell';
import { CalendarItem } from './calendar-item/CalendarItem';
import { CalendarTaskList } from './calendar-task-list/CalendarTaskList';
import styles from './calendarSlider.module.scss';

export const CalendarSlider = () => {
  const days = getCalendarDates();
  const { data: homeworks, isLoading, isFetching, isError, refetch } = useHomework();
  const homeworksByDate = groupHomeworksByDate(homeworks ?? []);
  const calendarItems = days.flatMap((dateItem) => ({
    date: dateItem,
    tasks: homeworksByDate[dateItem.date] ?? [],
  }));

  if (isLoading || isFetching) {
    return (
      <section className={styles.calendar}>
        <DataFallback
          state="loading"
          title="Загружаем календарь..."
          description="Собираем домашние задания по датам."
        />
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.calendar}>
        <DataFallback
          state="error"
          title="Не удалось загрузить календарь."
          description="Попробуйте обновить данные."
          onAction={() => void refetch()}
        />
      </section>
    );
  }

  return (
    <section className={styles.calendar}>
      <div className={styles.wrapper}>
        {calendarItems.map((item) => (
          <CalendarCell key={item.date.date}>
            <CalendarItem dataTime={item.date} />
            <CalendarTaskList tasks={item.tasks} />
          </CalendarCell>
        ))}
      </div>
    </section>
  );
};
