import { useQuery } from '@tanstack/react-query';

import { KnowledgeTestService } from '@/api/services/KnowledgeTestService.ts';

export const useTestReview = (testId: number) => {
  return useQuery({
    queryKey: ['test', 'review', testId],
    queryFn: () => KnowledgeTestService.getTestReview({ testId }),
    enabled: !!testId,
    staleTime: 30 * 1000,
  });
};
