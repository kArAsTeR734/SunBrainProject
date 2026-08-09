import { PATHS } from '@shared/routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { KnowledgeTestService } from '@/api/services/KnowledgeTestService.ts';

import { setTestSessionData } from '../models/setTestToSessionStorage.ts';
import type { KnowledgeTestSubjectId, StartTestResponse } from '../models/types.ts';

export const useStartTestMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['test', 'start'],
    mutationFn: (subjectId: KnowledgeTestSubjectId | undefined) => {
      if (!subjectId) {
        throw new Error('Subject code is required');
      }
      return KnowledgeTestService.startTest({ subjectCode: subjectId });
    },
    onSuccess: (data: StartTestResponse) => {
      queryClient.setQueryData(['test', data.testId], data);
      setTestSessionData<StartTestResponse>(data.testId, data);

      navigate(`${PATHS.TEST_RUN(data.subjectCode)}?testId=${data.testId}`);
    },
    onError: (error: Error) => {
      console.error('Произошла обишка', error);
    },
    onSettled: () => {
      console.log('Мутация отработала');
    },
  });
};
