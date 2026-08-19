import { KnowledgeTestService } from '@shared/api/services/KnowledgeTestService.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useFinishTestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['test', 'finish'],
    mutationFn: (testId: { testId: number }) => {
      return KnowledgeTestService.finishTest(testId);
    },
    onSuccess: (data, variables) => {
      if (!data.hasFailedTaskNumbers) {
        return;
      }

      void KnowledgeTestService.generateHomeworks({ testId: variables.testId })
        .then(async () => {
          await queryClient.invalidateQueries({
            queryKey: ['homeworks', 'homeworks-list'],
          });
        })
        .catch((error) => {
          console.error('Ошибка фоновой генерации домашек', error);
        });
    },
    onError: (err: Error) => {
      console.log(err);
    },
  });
};
