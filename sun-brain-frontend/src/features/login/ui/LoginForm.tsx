import type { LoginRequest } from '@entities/user';
import { TextField } from '@mui/material';
import { useFormValidationContext } from '@shared/lib';
import { emailValidation, passwordValidation } from '@shared/lib';
import { SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/shared/ui';

import { useLogin } from '../api/useLogin.ts';
import type { LoginFormValues } from '../model/types';
import styles from './loginForm.module.scss';

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
      <section className={styles.login}>
        <div className="container">
          <h2 className={styles.header}>Войти</h2>
          <div className={styles.wrapper}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
                helperText={
                  shouldShowError('password') ? getErrorMessage('password') : ''
                }
                label="Пароль"
                name="password"
                id="password"
                placeholder="Пароль"
                type="password"
              />
              <div className={styles.actions}>
                <Button type="submit" variant="auth">
                  Войти
                </Button>
                <div className={styles.divider}>Или</div>
                <Button type="button" variant="auth">
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
