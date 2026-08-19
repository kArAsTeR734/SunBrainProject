import { RegistrationForm, type RegistrationFormValues } from '@features/registration';
import { FormProvider, useForm } from 'react-hook-form';

import { Header } from '@/widgets/header';

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
