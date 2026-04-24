import './promo.scss';
import '@shared/ui/Button/button.scss';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui';

export const Promo = () => {
  const navigate = useNavigate();

  const handleClickTest = () => {
    navigate('/student/test');
  };

  const handleClickAccount = () => {
    navigate('/login');
  };
  return (
    <section className="promo">
      <div className="container">
        <div className="promo__body">
          <h1 className="promo__title">
            Твой личный путь к ЕГЭ – AI создаст план, а ты <br /> достигнешь
            цели!
          </h1>
          <p className="promo__subtitle">
            Измените свои привычки в учебе с помощью индивидуальных идей <br />{' '}
            искусственного интеллекта.
          </p>
          <div className="promo__actions">
            <Button
              className={clsx('button', 'button__pass-test')}
              onClick={handleClickTest}
            >
              Пройти вступительный тест
            </Button>
            <Button
              className={clsx('button', 'button__have-account')}
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
