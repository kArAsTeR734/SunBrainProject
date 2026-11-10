import { HomeworkService } from '@entities/homework';
import { useQuery } from '@tanstack/react-query';

export const useHomeworkTasks = (homeworkId: number) => {
  return useQuery({
    queryKey: ['homeworks', 'homeworks-tasks', homeworkId],
    queryFn: () => HomeworkService.getUserHomeworkTasks(homeworkId),
    staleTime: 1000 * 60 * 5,
    enabled: !!localStorage.getItem('access_token') && !!homeworkId,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
