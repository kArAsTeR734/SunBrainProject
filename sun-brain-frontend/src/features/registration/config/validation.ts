type FormWithPassword = {
  password: string;
};

export const confirmPasswordValidation = {
  required: 'Подтвердите пароль',
  validate: (value: string, values: FormWithPassword) =>
    value === values.password || 'Пароли не совпадают',
};

export const fullNameValidation = {
  required: 'Поле обязательно к заполнению',
  minLength: {
    value: 3,
    message: 'Минимальная длина 3 символа',
  },
};
