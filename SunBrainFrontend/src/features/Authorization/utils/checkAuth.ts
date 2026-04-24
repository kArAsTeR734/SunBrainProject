import { AppDispatch } from '@app/store/store.ts';
import { AuthorizationService } from '@/api/services/AuthorizationService.ts';
import { userSlice } from '@app/store/reducers/UserSlice.ts';

export const checkAuth = () => async (dispatch: AppDispatch) => {
  const { setLoading, setAuth } = userSlice.actions;
  try {
    dispatch(setLoading(true));

    const response = await AuthorizationService.refresh();
    localStorage.setItem('access_token', response.accessToken);

    dispatch(setAuth(true));
  } catch (error) {
    console.log(error);
    dispatch(setAuth(false));
  } finally {
    dispatch(setLoading(false));
  }
};
