import './studentAccount.scss';
import StudentAccountInfo from '@/widgets/StudentAccount/StudentAccountInfo';
import StudentAccountPosition from '@/widgets/StudentAccount/StudentAccountPosition';
import { Suspense } from 'react';
import { useAppSelector } from '@shared/hooks/redux.ts';
import { UserAuthPlaceholder } from '@entities/User';

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
