import { clsx } from 'clsx';
import { ButtonHTMLAttributes, ReactNode } from 'react';

import LoadingIcon from '@/assets/icons/loading.svg?react';

import styles from './button.module.scss';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'link' | 'icon' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'xs' | 'icon';
  isLoading?: boolean;
  className?: string;
};

const Button = ({
  variant = 'default',
  size = 'default',
  isLoading,
  disabled,
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;
  const buttonClass = clsx(
    styles.button,
    styles[`btn--variant-${variant}`],
    styles[`size-${size}`],
    {
      [styles[`state-disabled`]]: isDisabled,
      [styles[`state-loading`]]: isLoading,
    },
    className,
  );

  return (
    <button className={buttonClass} disabled={isDisabled} aria-disabled={isDisabled} type={type} {...props}>
      {isLoading ? <LoadingIcon className={styles['animate-spin']} /> : children}
    </button>
  );
};

export { Button };
