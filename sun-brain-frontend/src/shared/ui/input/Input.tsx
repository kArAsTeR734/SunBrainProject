import clsx from 'clsx';
import { forwardRef, InputHTMLAttributes } from 'react';

import styles from './input.module.scss';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string;
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, error, className, 'aria-describedby': describedBy, ...props }, ref) => (
    <div className={clsx(styles.field, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        {...props}
        ref={ref}
        id={id}
        className={styles.input}
        aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={
          [describedBy, error && `${id}-error`].filter(Boolean).join(' ') || undefined
        }
      />
      {error && (
        <span id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  ),
);
Input.displayName = 'Input';
