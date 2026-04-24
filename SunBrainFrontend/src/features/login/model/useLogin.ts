import { useMutation } from '@tanstack/react-query';
import { AuthorizationService } from '@/api/services/AuthorizationService.ts';
import { userSlice } from '@app/store/reducers/UserSlice.ts';
import { useAppDispatch } from '@shared/hooks/redux.ts';

export const useLogin = () => {
  const { setAuth, setUser } = userSlice.actions;
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: AuthorizationService.login,
    onSuccess: (userData) => {
      dispatch(setAuth(true));
      console.log(userData.user);
      if (userData.user.avatarUrl) {
        let avatarUrl = userData.user.avatarUrl;
        if (avatarUrl.startsWith('/uploads/')) {
          userData.user.avatarUrl = `http://localhost:5000${avatarUrl}`;
        }
      }
      console.log(userData.user.avatarUrl);
      dispatch(setUser(userData.user));
      localStorage.setItem('access_token', userData.accessToken);
    },
    onError: (error) => {
      console.log(error, error.message);
    },
  });
};
