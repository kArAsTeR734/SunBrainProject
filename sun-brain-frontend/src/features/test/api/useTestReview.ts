import { KnowledgeTestService } from '@shared/api/services/KnowledgeTestService.ts';
import { useQuery } from '@tanstack/react-query';

export const useTestReview = (testId: number) => {
  return useQuery({
    queryKey: ['test', 'review', testId],
    queryFn: () => KnowledgeTestService.getTestReview({ testId }),
    enabled: !!testId,
    staleTime: 30 * 1000,
  });
};
