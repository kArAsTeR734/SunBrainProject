import { HomeworkListItem } from '@entities/Homework/model/types.ts';
import { formatCalendarDeadline } from '@entities/Homework/lib/formatDeadline.ts';

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
