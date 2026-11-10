import { userActions } from '@entities/user';
import { AuthorizationService } from '@entities/user';
import { resolveAssetUrl } from '@shared/lib';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

export const useLogin = () => {
  const { setAuth, setUser } = userActions;
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: AuthorizationService.login,
    onSuccess: (userData) => {
      if (userData.user.avatarUrl) {
        userData.user.avatarUrl = resolveAssetUrl(userData.user.avatarUrl);
      }
      dispatch(setUser(userData.user));
      localStorage.setItem('access_token', userData.accessToken);
      dispatch(setAuth(true));
    },
    onError: (error) => {
      console.log(error, error.message);
    },
  });
};
