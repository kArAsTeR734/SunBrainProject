import './studentAccount.scss';
import { Suspense } from 'react';
import { useAppSelector } from '@shared/lib';
import { UserAuthPlaceholder } from '@entities/User';
import { StudentAccountInfo } from './StudentAccountInfo/StudentAccountInfo';
import { StudentAccountPosition } from './StudentAccountPosition/StudentAccountPosition';

export const StudentAccount = () => {
  const { isAuth } = useAppSelector((state) => state.userReducer);
  return (
    <>
      <section className="account">
        <div className="container">
          {isAuth ? (
            <Suspense fallback={<UserAuthPlaceholder />}>
              <div className="account__wrapper">
                <StudentAccountInfo />
                <div className="account__special--info">
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
