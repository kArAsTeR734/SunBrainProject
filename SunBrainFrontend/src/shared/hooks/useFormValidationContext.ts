import { type FieldValues, type Path, useFormContext } from 'react-hook-form';

export const useFormValidationContext = <T extends FieldValues>() => {
  const methods = useFormContext<T>();

  const shouldShowError = (fieldName: Path<T>): boolean => {
    return (
      methods.formState.isSubmitted && !!methods.formState.errors[fieldName]
    );
  };

  const getErrorMessage = (fieldName: Path<T>): string => {
    const error = methods.formState.errors[fieldName];
    return (error?.message as string) || '';
  };

  return {
    ...methods,
    shouldShowError,
    getErrorMessage,
  };
};
