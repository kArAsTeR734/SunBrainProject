import { useEffect } from 'react';
import { userActions, useUserInfo } from '@entities/User';
import { checkAuth } from '@features/Authorization';
import { useAppDispatch } from '@shared/lib';

export const AppInitializer = () => {
  const dispatch = useAppDispatch();
  const { setUser } = userActions;
  const { data: user } = useUserInfo();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setUser(user ?? null));
  }, [dispatch, user, setUser]);

  return null;
};
