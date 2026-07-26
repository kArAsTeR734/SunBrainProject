import { Link, useNavigate } from 'react-router-dom';
import { useFormValidationContext } from '@shared/lib';
import { SubmitHandler } from 'react-hook-form';
import { TextField } from '@mui/material';
import './loginForm.scss';
import clsx from 'clsx';
import '@shared/ui/Button/button.scss';
import { useLogin } from '../api/useLogin.ts';
import type { LoginRequest } from '@features/Registration';
import { Button } from '@/shared/ui';
import type { LoginFormValues } from '../model/types';
import { emailValidation, passwordValidation } from '@shared/lib';

export const LoginForm = () => {
  const { register, handleSubmit, shouldShowError, getErrorMessage, setError } =
    useFormValidationContext<LoginFormValues>();
  const { mutateAsync: login } = useLogin();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormValues> = async (formData) => {
    const loginData: LoginRequest = {
      email: formData.email,
      password: formData.password,
    };
    try {
      await login(loginData);
      navigate('/student/account');
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message || 'Неверный логин или пароль';

      setError('email', {
        type: 'server',
        message: serverMessage,
      });

      setError('password', {
        type: 'server',
        message: '',
      });
    }
  };

  return (
    <>
      <section className="login">
        <div className="container">
          <h2 className="login__header">Войти</h2>
          <div className="login__wrapper">
            <form onSubmit={handleSubmit(onSubmit)} className="login__form">
              <TextField
                {...register('email', emailValidation)}
                error={shouldShowError('email')}
                helperText={shouldShowError('email') ? getErrorMessage('email') : ''}
                label="Email"
                id="email"
                name="email"
                placeholder="Email"
                type={'email'}
              />
              <TextField
                {...register('password', passwordValidation)}
                error={shouldShowError('password')}
                helperText={shouldShowError('password') ? getErrorMessage('password') : ''}
                label="Пароль"
                name="password"
                id="password"
                placeholder="Пароль"
                type="password"
              />
              <div className="login__actions">
                <Button type="submit" className={clsx('button', 'button__auth')}>
                  Войти
                </Button>
                <div className="login__actions_divider">Или</div>
                <Button type="button" className={clsx('button', 'button__auth')}>
                  <Link to="/registration">Зарегистрироваться</Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
