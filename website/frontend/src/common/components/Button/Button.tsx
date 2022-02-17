import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

interface BaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: string;
  color?: 'success' | 'error' | 'main';
  size?: 'normal' | 'small';
}

interface TextProps extends BaseProps {
  text: string;
}

interface IconProps extends BaseProps {
  icon: string;
}

type Props = TextProps | IconProps;

const Button = ({ text, icon, className, color, size, ...attrs }: Props) => {
  const colorName = color || (text ? 'success' : '');
  const sizeName = size || (text ? 'normal' : '');

  const buttonClassName = clsx(
    styles.button,
    className,
    styles[colorName],
    styles[sizeName],
    icon && color && styles.singleIcon
  );

  return (
    <button className={buttonClassName} {...attrs}>
      {icon && <img src={icon} className={styles.icon} alt="Icon" />}
      {text}
    </button>
  );
};

export { Button };
