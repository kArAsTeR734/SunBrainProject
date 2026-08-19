import { HomeworkService } from '@shared/api/services/HomeworkService.ts';
import { useQuery } from '@tanstack/react-query';

export const useHomework = () => {
  return useQuery({
    queryKey: ['homeworks', 'homeworks-list'],
    queryFn: () => HomeworkService.getUserHomeworkList(),
    staleTime: 1000 * 60 * 5,
    enabled: !!localStorage.getItem('access_token'),
    refetchOnWindowFocus: false,
    select: (data) => data.homeworks,
  });
};
