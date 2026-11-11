import { userActions } from '@entities/user';
import type { Dispatch } from '@reduxjs/toolkit';
import { refreshSession } from '@shared/api';

// This check is only a bootstrap optimization. The API still verifies every JWT.
const hasUnexpiredAccessToken = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
    );
    return typeof payload.exp === 'number' && payload.exp > Date.now() / 1000 + 30;
  } catch {
    return false;
  }
};

export const checkAuth = async (dispatch: Dispatch) => {
  const { setLoading, setAuth, setError } = userActions;
  try {
    dispatch(setLoading(true));

    if (!hasUnexpiredAccessToken()) {
      await refreshSession();
    }

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
