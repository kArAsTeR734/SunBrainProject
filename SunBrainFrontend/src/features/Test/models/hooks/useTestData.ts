import { useMySearchParams } from '@shared/lib';
import { useQueryClient } from '@tanstack/react-query';

import { getTestSessionData } from '../setTestToSessionStorage';
import type { StartTestResponse } from '../types';

export const useTestData = () => {
  const searchParams = useMySearchParams('testId');

  const testId = Number(searchParams);

  const queryClient = useQueryClient();

  const queryCacheData = queryClient.getQueryData<StartTestResponse>(['test', testId]);
  const sessionData = getTestSessionData<StartTestResponse>(testId);

  const data = queryCacheData ?? sessionData;

  return {
    data,
    isReady: !!data,
  };
};
