import { TaskService } from '@entities/task';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useCatalogTasks = (themeId: number) =>
  useInfiniteQuery({
    queryKey: ['catalog-tasks', themeId],
    queryFn: ({ pageParam, signal }) =>
      TaskService.getCatalogTasks(themeId, pageParam, signal),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Number.isSafeInteger(themeId) && themeId > 0,
    staleTime: 60 * 1000 * 10,
    retry: 1,
  });
