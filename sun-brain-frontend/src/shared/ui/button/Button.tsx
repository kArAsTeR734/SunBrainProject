import clsx from 'clsx';
import React, { ButtonHTMLAttributes, FC } from 'react';

import styles from './button.module.scss';

type ButtonVariant = 'auth' | 'haveAccount' | 'logout' | 'passTest' | 'passTestStudent' | 'signIn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
}

export const Button: FC<ButtonProps> = ({ children, className, variant, ...props }) => {
  return (
    <button
      {...props}
      className={clsx(styles.button, variant && styles[variant], className)}
    >
      {children}
    </button>
  );
};
