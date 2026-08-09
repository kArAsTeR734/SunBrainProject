import { FC } from 'react';

import styles from './input.module.scss';

interface InputProps {
  id: string;
  label: string;
  name: string;
  placeholder: string;
  type: 'text' | 'email' | 'password' | 'phone';
}

export const Input: FC<InputProps> = ({ id, label, name, placeholder, type }) => {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        className={styles.input}
        name={name}
        id={id}
        placeholder={placeholder}
      />
    </div>
  );
};
