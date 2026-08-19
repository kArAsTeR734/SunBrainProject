export const emailValidation = {
  required: 'Поле обязательно к заполнению',
  minLength: {
    value: 5,
    message: 'Минимальная длина 10 символов',
  },
};

export const passwordValidation = {
  required: 'Поле обязательно к заполнению' as const,
  minLength: {
    value: 5,
    message: 'Минимальная длина 6 символов' as const,
  },
};
