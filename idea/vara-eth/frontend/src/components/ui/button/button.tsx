import { clsx } from 'clsx';
import { ButtonHTMLAttributes, ReactNode } from 'react';

import LoadingIcon from '@/assets/icons/loading.svg?react';

import styles from './button.module.scss';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'link' | 'icon' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'xs' | 'icon';
  isLoading?: boolean;
  loadingPosition?: 'start' | 'center' | 'end';
  className?: string;
};

const Button = ({
  variant = 'default',
  size = 'default',
  isLoading,
  disabled,
  children,
  className,
  loadingPosition = 'center',
  type = 'button',
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  const buttonClass = clsx(
    styles.button,
    styles[`btn--variant-${variant}`],
    styles[`size-${size}`],
    isLoading && styles[`loadingPosition${loadingPosition}`],
    className,
  );

  return (
    <button className={buttonClass} disabled={isDisabled} aria-disabled={isDisabled} type={type} {...props}>
      {isLoading && <LoadingIcon className={styles.spinner} />}
      <span className={styles.content}>{children}</span>
    </button>
  );
};

export { Button };
