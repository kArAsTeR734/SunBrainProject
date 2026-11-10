import { TaskService } from '@entities/task';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type UseSubmitTaskParams = {
  answer: string;
};

export const useCheckTask = (taskId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['checkAnswer'],
    mutationFn: ({ answer }: UseSubmitTaskParams) =>
      TaskService.checkTaskAnswer(taskId, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
    onError: (err) => {
      console.log(err);
    },
    onSettled: () => {
      console.log('Задание выполнено');
    },
  });
};
