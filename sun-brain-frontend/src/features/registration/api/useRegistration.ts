import { AuthorizationService } from '@entities/user';
import { useMutation } from '@tanstack/react-query';

export const useRegistration = () => {
  return useMutation({
    mutationFn: AuthorizationService.register,
    onError: (error) => {
      console.log(error, error.message);
    },
  });
};
