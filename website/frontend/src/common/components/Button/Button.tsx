import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  color?: 'success' | 'error' | 'main';
  size?: 'normal' | 'small';
  icon?: string;
}

const Button = ({ text, className, color = 'success', size = 'normal', icon, ...attrs }: Props) => {
  const buttonClassName = clsx(styles.button, className, styles[color], styles[size]);

  return (
    <button className={buttonClassName} {...attrs}>
      {icon && <img src={icon} className={styles.icon} alt="Icon" />}
      {text}
    </button>
  );
};

export { Button };
