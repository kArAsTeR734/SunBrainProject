import './calendarSlider.scss';
import CalendarItem from '@/widgets/CalendarSlider/CalendarItem';
import getCalendarDates from '@features/Calendar/getCalendarDates.ts';
import { useHomework } from '@features/HomeworkTasks/model/useHomework.ts';
import { groupHomeworksByDate } from '@features/HomeworkTasks/model/setHomeworks.ts';
import CalendarTaskList from '@widgets/CalendarSlider/CalendarTaskList';
import { CalendarCell } from '@/entities/Calendar';
import { DataFallback } from '@shared/ui';

export const CalendarSlider = () => {
  const days = getCalendarDates();
  const {
    data: homeworks,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useHomework();
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
