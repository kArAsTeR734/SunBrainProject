import { Profile } from '@entities/User';
import { useAppSelector } from '@shared/lib';
import { Button } from '@shared/ui';
import { useNavigate } from 'react-router-dom';

import styles from './ProfileHeaderData.module.scss';

export const ProfileHeaderData = () => {
  const navigate = useNavigate();
  const { isAuth } = useAppSelector((state) => state.userReducer);
  return (
    <>
      <div className={styles.userActions}>
        {!isAuth ? (
          <Button onClick={() => navigate('/login')} variant="signIn">
            Войти
          </Button>
        ) : (
          <Profile />
        )}
      </div>
    </>
  );
};
