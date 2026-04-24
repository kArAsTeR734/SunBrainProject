import { skipToken, useQuery } from '@tanstack/react-query';
import { KnowledgeTestService } from '@/api/services/KnowledgeTestService.ts';
import { KnowledgeTestSubjectId } from '@features/Test/models/types.ts';

export const useGetKnowledgeTestTotalTaskCount = (
  subjectId?: KnowledgeTestSubjectId,
) => {
  return useQuery({
    queryKey: ['test, meta', subjectId],
    queryFn: subjectId
      ? () => KnowledgeTestService.getTestMetaData({ subjectCode: subjectId })
      : skipToken,
    enabled: !!subjectId,
    retry: 3,
    select: (data) => data.targetTotalTasks,
  });
};
