import { skipToken, useQuery } from '@tanstack/react-query';

import type { KnowledgeTestSubjectId } from '../models/types.ts';
import { KnowledgeTestService } from './KnowledgeTestService';

export const useGetKnowledgeTestTotalTaskCount = (subjectId?: KnowledgeTestSubjectId) => {
  return useQuery({
    queryKey: ['test, meta', subjectId],
    queryFn: subjectId
      ? () => KnowledgeTestService.getTestMetaData({ subjectCode: subjectId })
      : skipToken,
    enabled: !!subjectId,
    retry: 3,
    select: (data) => data.plannedTotalTasks,
  });
};
