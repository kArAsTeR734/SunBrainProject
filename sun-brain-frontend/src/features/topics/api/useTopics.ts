import { TopicService } from '@shared/api/services/TopicService.ts';
import { useQuery } from '@tanstack/react-query';

export const useTopics = (subjectId: string) => {
  return useQuery({
    queryKey: ['topics', subjectId],
    queryFn: () => TopicService.getTopicsById(subjectId),
    staleTime: 1000 * 60 * 5,
    enabled: !!subjectId,
    refetchOnWindowFocus: true,
    select: (data) => data.topics,
  });
};
