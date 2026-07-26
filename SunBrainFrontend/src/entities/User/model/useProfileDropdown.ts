import { useNavigate } from 'react-router-dom';
import { userActions } from './userSlice';
import { useAppDispatch } from '@shared/lib';

export const useProfileDropdown = () => {
  const navigate = useNavigate();

  const { logout } = userActions;
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
