import { useUserState } from '@entities/user';
import { PATHS } from '@shared/routes';
import { Button } from '@shared/ui';
import { useNavigate } from 'react-router-dom';

import styles from './promo.module.scss';

export const Promo = () => {
  const navigate = useNavigate();
  const { isAuth } = useUserState();

  return (
    <section className={styles.promo}>
      <div className="container">
        <div className={styles.body}>
          <p className={styles.eyebrow}>Математика и физика · ОГЭ и ЕГЭ</p>
          <h1 className={styles.title}>Подготовка к экзаменам в своём темпе</h1>
          <p className={styles.subtitle}>
            Проверьте знания на диагностическом тесте и узнайте, какие темы стоит
            повторить.
          </p>
          <div className={styles.actions}>
            <Button onClick={() => navigate(PATHS.TEST)}>Пройти диагностику</Button>
            <Button
              variant="haveAccount"
              onClick={() => navigate(isAuth ? PATHS.STUDENT.ACCOUNT : PATHS.LOGIN)}
            >
              {isAuth ? 'Личный кабинет' : 'У меня есть аккаунт'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
