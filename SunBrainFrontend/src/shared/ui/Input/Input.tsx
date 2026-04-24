import { FC } from 'react';
import './input.css';

interface InputProps {
  id: string;
  label: string;
  name: string;
  placeholder: string;
  type: 'text' | 'email' | 'password' | 'phone';
}

export const Input: FC<InputProps> = ({
  id,
  label,
  name,
  placeholder,
  type,
}) => {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        className="field__input"
        name={name}
        id={id}
        placeholder={placeholder}
      />
    </div>
  );
};
