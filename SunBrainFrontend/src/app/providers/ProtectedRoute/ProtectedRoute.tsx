import { useAppSelector } from '@shared/hooks/redux.ts';
import { Loader } from '@shared/ui';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuth, isLoading } = useAppSelector((state) => state.userReducer);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
