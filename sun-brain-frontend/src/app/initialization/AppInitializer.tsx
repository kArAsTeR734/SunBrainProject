import { useUserInfo } from '@entities/user';
import { useAppDispatch } from '@shared/lib';
import { useEffect } from 'react';

import { checkAuth } from './checkAuth';

export const AppInitializer = () => {
  const dispatch = useAppDispatch();
  useUserInfo();

  useEffect(() => {
    void checkAuth(dispatch);
  }, [dispatch]);

  return null;
};
