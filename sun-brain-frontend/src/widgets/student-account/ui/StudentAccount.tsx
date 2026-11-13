import { UserAuthPlaceholder } from '@entities/user';
import { useUserState } from '@entities/user';
import { Suspense } from 'react';

import { StudentAccountInfo } from './student-account-info/StudentAccountInfo';
import { StudentAccountPosition } from './student-account-position/StudentAccountPosition';
import styles from './studentAccount.module.scss';

export const StudentAccount = () => {
  const { isAuth } = useUserState();
  return (
    <>
      <section className={styles.account}>
        <div className="container">
          <h1 className={styles.title}>Личный кабинет</h1>
          <p className={styles.description}>Ваш профиль и результаты подготовки.</p>
          {isAuth ? (
            <Suspense fallback={<UserAuthPlaceholder />}>
              <div className={styles.wrapper}>
                <StudentAccountInfo />
                <div className={styles.specialInfo}>
                  <StudentAccountPosition />
                </div>
              </div>
            </Suspense>
          ) : (
            <UserAuthPlaceholder />
          )}
        </div>
      </section>
    </>
  );
};
