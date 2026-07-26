import { useMutation } from '@tanstack/react-query';
import { AuthorizationService } from '@/api/services/AuthorizationService.ts';

export const useRegistration = () => {
  return useMutation({
    mutationFn: AuthorizationService.register,
    onError: (error) => {
      console.log(error, error.message);
    },
  });
};
