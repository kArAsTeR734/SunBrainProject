import { useAppDispatch } from '@shared/lib';
import { PATHS } from '@shared/routes';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthorizationService } from '../api/AuthorizationService';
import { userActions } from './userSlice';

export const useProfileDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError('');
    try {
      await AuthorizationService.logout();
      localStorage.removeItem('access_token');
      dispatch(userActions.logout());
      queryClient.clear();
      navigate(PATHS.LOGIN);
    } catch {
      setLogoutError('Не удалось выйти. Попробуйте ещё раз.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { handleLogout, isLoggingOut, logoutError };
};
