import { useQuery } from '@tanstack/react-query';
import { KnowledgeTestService } from '@/api/services/KnowledgeTestService.ts';

export const useTestReview = (testId: number) => {
  return useQuery({
    queryKey: ['test', 'review', testId],
    queryFn: () => KnowledgeTestService.getTestReview({ testId }),
    retry: 2,
    retryDelay: 1500,
    refetchInterval: (query) => (query.state.data ? false : 2500),
    refetchIntervalInBackground: true,
    enabled: !!testId,
    staleTime: 30 * 1000,
  });
};
