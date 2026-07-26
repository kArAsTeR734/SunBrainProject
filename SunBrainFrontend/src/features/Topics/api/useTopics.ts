import { useQuery } from '@tanstack/react-query';
import { TopicService } from '@/api/services/TopicService.ts';

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
