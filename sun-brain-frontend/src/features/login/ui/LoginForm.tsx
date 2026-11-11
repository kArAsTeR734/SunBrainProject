import type { LoginRequest } from '@entities/user';
import { TextField } from '@mui/material';
import { useFormValidationContext } from '@shared/lib';
import { emailValidation, passwordValidation } from '@shared/lib';
import styles from '@shared/styles/auth-form.module.scss';
import { isAxiosError } from 'axios';
import { SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/shared/ui';

import { useLogin } from '../api/useLogin.ts';
import type { LoginFormValues } from '../model/types';

export const LoginForm = () => {
  const { register, handleSubmit, shouldShowError, getErrorMessage, setError } =
    useFormValidationContext<LoginFormValues>();
  const { mutateAsync: login, isPending } = useLogin();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormValues> = async (formData) => {
    const loginData: LoginRequest = {
      email: formData.email,
      password: formData.password,
    };
    try {
      await login(loginData);
      navigate('/student/account');
    } catch (error) {
      const serverMessage = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;

      setError('email', {
        type: 'server',
        message: serverMessage ?? 'Не удалось войти. Проверьте логин и пароль.',
      });

      setError('password', {
        type: 'server',
        message: '',
      });
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="login-title">
        <h1 className={styles.header} id="login-title">
          Вход
        </h1>
        <p className={styles.description}>Войдите, чтобы продолжить подготовку.</p>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <TextField
            {...register('email', emailValidation)}
            error={shouldShowError('email')}
            helperText={shouldShowError('email') ? getErrorMessage('email') : ''}
            label="Email"
            id="email"
            autoComplete="email"
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
            autoComplete="current-password"
          />
          <div className={styles.actions}>
            <Button type="submit" variant="auth" disabled={isPending}>
              {isPending ? 'Входим…' : 'Войти'}
            </Button>
            <p className={styles.alternative}>
              Впервые в SunBrain? <Link to="/registration">Зарегистрироваться</Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
};
