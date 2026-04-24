import { Link, useNavigate } from 'react-router-dom';
import { useFormValidationContext } from '@shared/hooks/useFormValidationContext.ts';
import { SubmitHandler } from 'react-hook-form';
import { TextField } from '@mui/material';
import clsx from 'clsx';
import './registrationForm.scss';
import {
  confirmPasswordValidation,
  emailValidation,
  fullNameValidation,
  passwordValidation,
} from '@features/Authorization/model/config/validationConfig.ts';
import { useEffect } from 'react';
import { RegistrationRequest } from '@features/Registration/model/types.ts';
import { Button } from '@shared/ui';
import { useRegistration } from '@features/Registration';

export interface RegistrationFormInput {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  role?: string;
}

export const RegistrationForm = () => {
  const { register, handleSubmit, shouldShowError, getErrorMessage, reset } =
    useFormValidationContext<RegistrationFormInput>();

  const { mutateAsync: registration, reset: clearError } = useRegistration();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegistrationFormInput> = async (formData) => {
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
      <section className="registration">
        <div className="container">
          <h2 className="registration__header">Регистрация</h2>
          <div className="registration__wrapper">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="registration__form"
            >
              <TextField
                {...register('email', emailValidation)}
                type="email"
                error={shouldShowError('email')}
                helperText={
                  shouldShowError('email') ? getErrorMessage('email') : ''
                }
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

              <div className="registration__actions">
                <Button className={['button', 'button__auth'].join(' ')}>
                  Зарегистрироваться
                </Button>
                <div className="registration__actions_divider">Или</div>
                <Button className={clsx('button', 'button__auth')}>
                  <Link
                    className={clsx('button', 'button button__text')}
                    to="/login"
                  >
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
