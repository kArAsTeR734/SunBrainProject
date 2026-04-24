import { useMutation } from '@tanstack/react-query';
import { KnowledgeTestService } from '@/api/services/KnowledgeTestService.ts';

interface SubmitMutationParams {
  testId: number;
  taskId: number;
  answer: string;
}

export const useSubmitTestTaskMutation = () => {
  return useMutation({
    mutationKey: ['test', 'submit-answer'],
    mutationFn: ({ testId, taskId, answer }: SubmitMutationParams) => {
      return KnowledgeTestService.testSubmitAnswer(
        { testId },
        { taskId, answer },
      );
    },
    onSuccess: () => {
      console.log('Successfully submitted task');
    },
    onError: (error: Error) => {
      console.log(error);
    },
  });
};
