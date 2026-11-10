import { useUserInfo } from '@entities/user';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { checkAuth } from './checkAuth';

export const AppInitializer = () => {
  const dispatch = useDispatch();
  useUserInfo();

  useEffect(() => {
    void checkAuth(dispatch);
  }, [dispatch]);

  return null;
};
