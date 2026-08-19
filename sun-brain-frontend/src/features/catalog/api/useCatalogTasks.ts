import { TaskService } from '@shared/api/services/TaskService.ts';
import { useQuery } from '@tanstack/react-query';

export const useCatalogTasks = (themeId: number) => {
  return useQuery({
    queryKey: ['catalog-tasks', themeId],
    queryFn: () => TaskService.getCatalogTasks(themeId),
    staleTime: 60 * 1000 * 10,
    retry: 1,
    select: (data) => data.catalogTasks,
  });
};
