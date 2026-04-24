import { useEffect } from 'react';
import { useAppDispatch } from '@shared/hooks/redux.ts';
import { useUserInfo } from '@entities/User/models/useUserInfo.ts';
import { userSlice } from '@app/store/reducers/UserSlice.ts';
import { checkAuth } from '@features/Authorization/utils/checkAuth.ts';

export const AppInitializer = () => {
  const dispatch = useAppDispatch();
  const { setUser } = userSlice.actions;
  const { data: user } = useUserInfo();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(setUser(user ?? null));
  }, [dispatch, user, setUser]);

  return null;
};
