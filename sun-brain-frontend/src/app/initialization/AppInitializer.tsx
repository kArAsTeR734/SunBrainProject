import { userActions, useUserInfo } from '@entities/user';
import { useAppDispatch } from '@shared/lib';
import { useEffect } from 'react';
import { checkAuth } from 'src/features/auth-check';

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
