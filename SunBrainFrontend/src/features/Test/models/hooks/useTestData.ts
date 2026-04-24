import { useQueryClient } from '@tanstack/react-query';
import { StartTestResponse } from '@features/Test/models/types.ts';
import { getTestSessionData } from '@features/Test';
import { useMySearchParams } from '@shared/hooks/useMySearchParams.ts';

export const useTestData = () => {
  const searchParams = useMySearchParams('testId');

  const testId = Number(searchParams);

  const queryClient = useQueryClient();

  const queryCacheData = queryClient.getQueryData<StartTestResponse>([
    'test',
    testId,
  ]);
  const sessionData = getTestSessionData<StartTestResponse>(testId);

  const data = queryCacheData ?? sessionData;

  return {
    data,
    isReady: !!data,
  };
};
