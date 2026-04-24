import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KnowledgeTestService } from '@/api/services/KnowledgeTestService.ts';

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
          await queryClient.invalidateQueries({ queryKey: ['homework-list'] });
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
