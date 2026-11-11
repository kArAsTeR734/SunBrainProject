import { userActions, useUserInfo } from '@entities/user';
import { SESSION_EXPIRED_EVENT } from '@shared/api';
import { useAppDispatch } from '@shared/lib';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { checkAuth } from './checkAuth';

export const AppInitializer = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  useUserInfo();

  useEffect(() => {
    const onExpired = () => {
      dispatch(userActions.logout());
      queryClient.clear();
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    void checkAuth(dispatch);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, [dispatch, queryClient]);

  return null;
};
