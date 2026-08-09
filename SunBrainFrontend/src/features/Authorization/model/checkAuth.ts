import { userActions } from '@entities/User';
import { useAppDispatch } from '@shared/lib';

import { AuthorizationService } from '@/api/services/AuthorizationService.ts';

export const checkAuth = () => async () => {
  const { setLoading, setAuth, setError } = userActions;
  const dispatch = useAppDispatch();
  try {
    dispatch(setLoading(true));

    const response = await AuthorizationService.refresh();
    localStorage.setItem('access_token', response.accessToken);

    dispatch(setAuth(true));
  } catch (error) {
    dispatch(setAuth(false));
    if (error instanceof Error) {
      dispatch(setError(error.message));
    }
  } finally {
    dispatch(setLoading(false));
  }
};
