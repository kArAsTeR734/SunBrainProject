import { useQueryClient } from '@tanstack/react-query';
import type { StartTestResponse } from '../types';
import { getTestSessionData } from '../setTestToSessionStorage';
import { useMySearchParams } from '@shared/lib';

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
