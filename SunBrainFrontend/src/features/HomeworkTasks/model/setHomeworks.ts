import { formatCalendarDeadline, type HomeworkListItem } from '@entities/Homework';

export const groupHomeworksByDate = (homeworks: HomeworkListItem[]) => {
  const map: Record<string, HomeworkListItem[]> = {};

  homeworks.forEach((hw) => {
    const formattedDate = formatCalendarDeadline(hw.deadline);

    if (!map[formattedDate]) {
      map[formattedDate] = [];
    }

    map[formattedDate].push(hw);
  });

  return map;
};
