import { FormProvider, useForm } from 'react-hook-form';
import { Header } from '@widgets/Header';
import { LoginForm, LoginFormValues } from '@features/login';

export const LoginPage = () => {
  const methods = useForm<LoginFormValues>();
  return (
    <>
      <Header />
      <FormProvider {...methods}>
        <LoginForm />
      </FormProvider>
    </>
  );
};
