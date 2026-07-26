import { RegistrationForm, type RegistrationFormValues } from '@features/Registration';
import { FormProvider, useForm } from 'react-hook-form';
import { Header } from '@/widgets/Header';

export const RegistrationPage = () => {
  const methods = useForm<RegistrationFormValues>();
  return (
    <>
      <Header />
      <FormProvider {...methods}>
        <RegistrationForm />
      </FormProvider>
    </>
  );
};
