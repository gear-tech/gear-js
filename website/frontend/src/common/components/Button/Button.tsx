import React from 'react';
import clsx from 'clsx';
import { Props } from './types';
import styles from './Button.module.scss';

const Button = ({ text, icon, className, color, size, ...attrs }: Props) => {
  const colorName = color || (text ? 'success' : '');
  const sizeName = size || (text ? 'normal' : '');

  const buttonClassName = clsx(
    styles.button,
    className,
    styles[colorName],
    styles[sizeName],
    icon && color && !text && styles.singleIcon
  );

  return (
    <button className={buttonClassName} {...attrs}>
      {icon && <img src={icon} className={styles.icon} alt="Icon" />}
      {text}
    </button>
  );
};

export { Button };
