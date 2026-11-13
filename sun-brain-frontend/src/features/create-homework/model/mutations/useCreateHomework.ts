import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createHomework } from '../../api/createHomework';
import type { HomeworkFormValues } from '../homeworkSchema';

interface CreateHomeworkOptions {
  onClose: () => void;
  onPendingChange: (pending: boolean) => void;
}

export const useCreateHomework = ({
  onClose,
  onPendingChange,
}: CreateHomeworkOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: HomeworkFormValues) =>
      createHomework({
        title: values.title,
        subjectCode: `${values.exam}${values.subject}`,
        topicId: Number(values.topic),
        count: Number(values.count),
        deadline: new Date(`${values.date}T${values.time}`).toISOString(),
      }),
    onMutate: () => onPendingChange(true),
    onSettled: () => onPendingChange(false),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['homeworks'] });
      onClose();
    },
  });
};
