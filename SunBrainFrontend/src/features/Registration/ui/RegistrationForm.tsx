import { useRegistration } from '@features/Registration';
import { TextField } from '@mui/material';
import { useFormValidationContext } from '@shared/lib';
import { emailValidation, passwordValidation } from '@shared/lib';
import { Button } from '@shared/ui';
import { useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { confirmPasswordValidation, fullNameValidation } from '../config/validation';
import type { RegistrationFormValues, RegistrationRequest } from '../model/types';
import styles from './registrationForm.module.scss';

export const RegistrationForm = () => {
  const { register, handleSubmit, shouldShowError, getErrorMessage, reset } =
    useFormValidationContext<RegistrationFormValues>();

  const { mutateAsync: registration, reset: clearError } = useRegistration();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegistrationFormValues> = async (formData) => {
    const registerData: RegistrationRequest = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
    };
    try {
      await registration(registerData);
      navigate('/login');
    } finally {
      reset();
    }
  };

  useEffect(() => {
    clearError();
  }, [clearError]);
  return (
    <>
      <section className={styles.registration}>
        <div className="container">
          <h2 className={styles.header}>Регистрация</h2>
          <div className={styles.wrapper}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <TextField
                {...register('email', emailValidation)}
                type="email"
                error={shouldShowError('email')}
                helperText={shouldShowError('email') ? getErrorMessage('email') : ''}
                label="Логин"
                id="email"
                name="email"
                placeholder="example@.com"
              />
              <TextField
                {...register('fullName', fullNameValidation)}
                type="text"
                error={shouldShowError('fullName')}
                helperText={
                  shouldShowError('fullName') ? getErrorMessage('fullName') : ''
                }
                label="Имя и Фамилия"
                id="fullName"
                name="fullName"
                placeholder="Иван Иванович"
              />
              <TextField
                {...register('password', passwordValidation)}
                type="password"
                error={shouldShowError('password')}
                helperText={
                  shouldShowError('password') ? getErrorMessage('password') : ''
                }
                label="Пароль"
                name="password"
                id="password"
                placeholder="******"
              />
              <TextField
                {...register('confirmPassword', confirmPasswordValidation)}
                type="password"
                error={shouldShowError('confirmPassword')}
                helperText={
                  shouldShowError('confirmPassword')
                    ? getErrorMessage('confirmPassword')
                    : ''
                }
                label="Подтверждение пароля"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="******"
              />

              <div className={styles.actions}>
                <Button variant="auth">
                  Зарегистрироваться
                </Button>
                <div className={styles.divider}>Или</div>
                <Button variant="auth">
                  <Link to="/login">
                    Уже есть аккаунт
                  </Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
