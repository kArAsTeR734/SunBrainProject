import { LoginForm, LoginFormValues } from '@features/login';
import { Header } from '@widgets/header';
import { FormProvider, useForm } from 'react-hook-form';

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
