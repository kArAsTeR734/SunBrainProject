import { useUserState } from '@entities/user';
import { Button } from '@shared/ui';
import { useNavigate } from 'react-router-dom';

import styles from './promo.module.scss';

export const Promo = () => {
  const navigate = useNavigate();
  const { isAuth } = useUserState();

  const handleClickTest = () => {
    navigate('/student/test');
  };

  const handleClickAccount = () => {
    if (!isAuth) {
      navigate('/login');
    }
    navigate('/student/account');
  };
  return (
    <section className={styles.promo}>
      <div className="container">
        <div className={styles.body}>
          <h1 className={styles.title}>
            Твой личный путь к ЕГЭ – AI создаст план, а ты <br /> достигнешь цели!
          </h1>
          <p className={styles.subtitle}>
            Измените свои привычки в учебе с помощью индивидуальных идей <br />{' '}
            искусственного интеллекта.
          </p>
          <div className={styles.actions}>
            <Button
              variant="passTest"
              onClick={handleClickTest}
            >
              Пройти вступительный тест
            </Button>
            <Button
              variant="haveAccount"
              onClick={handleClickAccount}
            >
              У меня уже есть аккаунт
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
