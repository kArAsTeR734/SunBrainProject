import { userActions } from '@entities/user';
import { AuthorizationService } from '@shared/api/services/AuthorizationService.ts';
import { resolveAssetUrl } from '@shared/lib';
import { useAppDispatch } from '@shared/lib';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  const { setAuth, setUser } = userActions;
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: AuthorizationService.login,
    onSuccess: (userData) => {
      dispatch(setAuth(true));
      if (userData.user.avatarUrl) {
        userData.user.avatarUrl = resolveAssetUrl(userData.user.avatarUrl);
      }
      dispatch(setUser(userData.user));
      localStorage.setItem('access_token', userData.accessToken);
    },
    onError: (error) => {
      console.log(error, error.message);
    },
  });
};
