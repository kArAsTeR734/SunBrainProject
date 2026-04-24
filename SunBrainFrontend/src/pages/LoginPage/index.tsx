import { LoginForm, LoginFormInput } from '@features/login/ui/LoginForm.tsx';
import { FormProvider, useForm } from 'react-hook-form';
import Header from '@/widgets/Header';

export const LoginPage = () => {
  const methods = useForm<LoginFormInput>();
  return (
    <>
      <Header />
      <FormProvider {...methods}>
        <LoginForm />
      </FormProvider>
    </>
  );
};
