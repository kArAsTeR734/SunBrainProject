import { useAppDispatch } from '@shared/lib';
import { useNavigate } from 'react-router-dom';

import { AuthorizationService } from '../api/AuthorizationService';
import { userActions } from './userSlice';

export const useProfileDropdown = () => {
  const navigate = useNavigate();

  const { logout } = userActions;
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    dispatch(logout());
    await AuthorizationService.logout();
    localStorage.removeItem('access_token');
    alert('Вы вышли из аккаунта!');
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
