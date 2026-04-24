import { useNavigate } from 'react-router-dom';
import { userSlice } from '@app/store/reducers/UserSlice.ts';
import { useAppDispatch } from '@shared/hooks/redux.ts';

export const useProfile = () => {
  const navigate = useNavigate();

  const { logout } = userSlice.actions;
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    dispatch(logout());
  };

  const handleTest = () => {
    navigate('/student/test');
  };

  const handleAccount = () => {
    navigate('/student/account');
  };

  const handleHomeworks = () => {
    navigate('/student/homework');
  };

  return {
    handleLogout,
    handleTest,
    handleAccount,
    handleHomeworks,
  };
};
