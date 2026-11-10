import { userActions } from '@entities/user';
import type { Dispatch } from '@reduxjs/toolkit';
import { refreshSession } from '@shared/api';

export const checkAuth = async (dispatch: Dispatch) => {
  const { setLoading, setAuth, setError } = userActions;
  try {
    dispatch(setLoading(true));

    const response = await refreshSession();
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
