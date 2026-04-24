import { Link, useNavigate } from 'react-router-dom';
import { useFormValidationContext } from '@shared/hooks/useFormValidationContext.ts';
import { SubmitHandler } from 'react-hook-form';
import { TextField } from '@mui/material';
import './loginForm.scss';
import {
  emailValidation,
  passwordValidation,
} from '@features/Authorization/model/config/validationConfig.ts';
import clsx from 'clsx';
import '@shared/ui/Button/button.css';
import { useLogin } from '@features/login/model/useLogin.ts';
import { LoginRequest } from '@features/Registration/model/types.ts';
import { Button } from '@/shared/ui';

export interface LoginFormInput {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const { register, handleSubmit, shouldShowError, getErrorMessage, setError } =
    useFormValidationContext<LoginFormInput>();
  const { mutateAsync: login } = useLogin();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInput> = async (formData) => {
    const loginData: LoginRequest = {
      email: formData.email,
      password: formData.password,
    };
    try {
      await login(loginData);
      navigate('/student/account');
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message || 'Неверный логин или пароль';

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
                helperText={
                  shouldShowError('email') ? getErrorMessage('email') : ''
                }
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
              <div className="login__actions">
                <Button
                  type="submit"
                  className={clsx('button', 'button__auth')}
                >
                  Войти
                </Button>
                <div className="login__actions_divider">Или</div>
                <Button
                  type="button"
                  className={clsx('button', 'button__auth')}
                >
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
