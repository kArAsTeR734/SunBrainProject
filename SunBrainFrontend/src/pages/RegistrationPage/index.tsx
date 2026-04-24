import {
  RegistrationForm,
  RegistrationFormInput,
} from '@features/Registration/ui/RegistrationForm.tsx';
import { FormProvider, useForm } from 'react-hook-form';
import Header from '@/widgets/Header';

export const RegistrationPage = () => {
  const methods = useForm<RegistrationFormInput>();
  return (
    <>
      <Header />
      <FormProvider {...methods}>
        <RegistrationForm />
      </FormProvider>
    </>
  );
};
