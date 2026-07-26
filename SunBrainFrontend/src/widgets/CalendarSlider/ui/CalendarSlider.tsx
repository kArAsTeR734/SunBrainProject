import './calendarSlider.scss';
import { getCalendarDates } from '@features/Calendar';
import { groupHomeworksByDate, useHomework } from '@features/HomeworkTasks';
import { DataFallback } from '@shared/ui';
import { CalendarCell } from './CalendarCell/CalendarCell';
import { CalendarItem } from './CalendarItem/CalendarItem';
import { CalendarTaskList } from './CalendarTaskList/CalendarTaskList';

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
      <section className="calendar">
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
      <section className="calendar">
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
    <section className="calendar">
      <div className="calendar__wrapper">
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
