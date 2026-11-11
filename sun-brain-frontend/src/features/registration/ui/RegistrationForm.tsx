import type { RegistrationRequest } from '@entities/user';
import { Alert, TextField } from '@mui/material';
import { useFormValidationContext } from '@shared/lib';
import { emailValidation, passwordValidation } from '@shared/lib';
import styles from '@shared/styles/auth-form.module.scss';
import { Button } from '@shared/ui';
import { useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { useRegistration } from '../api/useRegistration';
import { confirmPasswordValidation, fullNameValidation } from '../config/validation';
import type { RegistrationFormValues } from '../model/types';

export const RegistrationForm = () => {
  const { register, handleSubmit, shouldShowError, getErrorMessage, reset } =
    useFormValidationContext<RegistrationFormValues>();

  const {
    mutateAsync: registration,
    reset: clearError,
    isPending,
    isError,
  } = useRegistration();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegistrationFormValues> = async (formData) => {
    const registerData: RegistrationRequest = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
    };
    try {
      await registration(registerData);
      reset();
      navigate('/login');
    } catch {
      // The mutation displays its error beside the submit button.
    }
  };

  useEffect(() => {
    clearError();
  }, [clearError]);
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="registration-title">
        <h1 className={styles.header} id="registration-title">
          Регистрация
        </h1>
        <p className={styles.description}>
          Создайте аккаунт, чтобы сохранять результаты.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <TextField
            {...register('email', emailValidation)}
            type="email"
            error={shouldShowError('email')}
            helperText={shouldShowError('email') ? getErrorMessage('email') : ''}
            label="Логин"
            id="email"
            autoComplete="email"
            name="email"
            placeholder="example@.com"
          />
          <TextField
            {...register('fullName', fullNameValidation)}
            type="text"
            error={shouldShowError('fullName')}
            helperText={shouldShowError('fullName') ? getErrorMessage('fullName') : ''}
            label="Имя и Фамилия"
            id="fullName"
            autoComplete="name"
            name="fullName"
            placeholder="Иван Иванович"
          />
          <TextField
            {...register('password', passwordValidation)}
            type="password"
            autoComplete="new-password"
            error={shouldShowError('password')}
            helperText={shouldShowError('password') ? getErrorMessage('password') : ''}
            label="Пароль"
            name="password"
            id="password"
            placeholder="******"
          />
          <TextField
            {...register('confirmPassword', confirmPasswordValidation)}
            type="password"
            autoComplete="new-password"
            error={shouldShowError('confirmPassword')}
            helperText={
              shouldShowError('confirmPassword') ? getErrorMessage('confirmPassword') : ''
            }
            label="Подтверждение пароля"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="******"
          />

          {isError && (
            <Alert severity="error">
              Не удалось создать аккаунт. Проверьте данные и попробуйте ещё раз.
            </Alert>
          )}
          <div className={styles.actions}>
            <Button type="submit" variant="auth" disabled={isPending}>
              {isPending ? 'Создаём аккаунт…' : 'Создать аккаунт'}
            </Button>
            <p className={styles.alternative}>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
};
