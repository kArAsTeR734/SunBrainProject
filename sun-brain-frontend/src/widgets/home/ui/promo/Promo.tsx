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
          <div className={styles.content}>
            <p className={styles.eyebrow}>Математика и физика · ОГЭ и ЕГЭ</p>
            <h1 className={styles.title}>
              Подготовка к экзаменам <span>в своём темпе</span>
            </h1>
            <p className={styles.subtitle}>
              От первого теста до уверенного решения. Узнайте, какие темы стоит повторить,
              и двигайтесь к цели шаг за шагом.
            </p>
            <div className={styles.actions}>
              <Button onClick={() => navigate(PATHS.TEST)}>
                Пройти диагностику <span aria-hidden="true">↗</span>
              </Button>
              <Button
                variant="haveAccount"
                onClick={() => navigate(isAuth ? PATHS.STUDENT.ACCOUNT : PATHS.LOGIN)}
              >
                {isAuth ? 'Личный кабинет' : 'У меня есть аккаунт'}
              </Button>
            </div>
          </div>
          <div className={styles.visual} aria-hidden="true">
            <div className={styles.sun}>✳</div>
            <div className={styles.route}>
              <p className={styles.routeLabel}>ВАШ ПУТЬ К ЗНАНИЯМ</p>
              <div className={styles.step}>
                <span className={styles.stepNumber}>01</span>
                <div>
                  <strong>Узнайте свой уровень</strong>
                  <span>Диагностика знаний</span>
                </div>
                <span className={styles.stepArrow}>↗</span>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>02</span>
                <div>
                  <strong>Разберитесь в сложном</strong>
                  <span>Практика по темам</span>
                </div>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>03</span>
                <div>
                  <strong>Закрепите результат</strong>
                  <span>Домашние задания</span>
                </div>
              </div>
              <p className={styles.routeNote}>Маленькие шаги. Большая уверенность.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
