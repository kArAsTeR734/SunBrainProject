import { UserAuthPlaceholder } from '@entities/User';
import { useAppSelector } from '@shared/lib';
import { Suspense } from 'react';

import styles from './studentAccount.module.scss';
import { StudentAccountInfo } from './StudentAccountInfo/StudentAccountInfo';
import { StudentAccountPosition } from './StudentAccountPosition/StudentAccountPosition';

export const StudentAccount = () => {
  const { isAuth } = useAppSelector((state) => state.userReducer);
  return (
    <>
      <section className={styles.account}>
        <div className="container">
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
