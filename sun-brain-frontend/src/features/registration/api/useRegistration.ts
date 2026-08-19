import { AuthorizationService } from '@shared/api/services/AuthorizationService.ts';
import { useMutation } from '@tanstack/react-query';

export const useRegistration = () => {
  return useMutation({
    mutationFn: AuthorizationService.register,
    onError: (error) => {
      console.log(error, error.message);
    },
  });
};
