import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui';
import '@shared/ui/Button/button.scss';
import { Profile } from '@entities/User';
import { useAppSelector } from '@shared/lib';

export const ProfileHeaderData = () => {
  const navigate = useNavigate();
  const { isAuth } = useAppSelector((state) => state.userReducer);
  return (
    <>
      <div className="user-actions">
        {!isAuth ? (
          <Button onClick={() => navigate('/login')} className="button button__sign-in">
            Войти
          </Button>
        ) : (
          <Profile />
        )}
      </div>
    </>
  );
};
