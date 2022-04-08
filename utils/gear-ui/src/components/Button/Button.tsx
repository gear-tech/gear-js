import clsx from 'clsx';
import { Props } from './Button.types';
import styles from './Button.module.scss';

const Button = ({ text, icon, className, type = 'button', color = 'primary', size = 'normal', ...attrs }: Props) => {
  const buttonClassName = clsx(styles.button, className, styles[color], styles[text ? size : 'noText']);

  return (
    <button type={type} className={buttonClassName} {...attrs}>
      {icon && <img src={icon} alt="button icon" className={styles.icon} />}
      {text}
    </button>
  );
};

export { Button, Props as ButtonProps, styles as buttonStyles };
