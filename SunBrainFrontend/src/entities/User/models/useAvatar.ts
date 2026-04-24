import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/api/services/UserService.ts';

export const useAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => UserService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });
};
