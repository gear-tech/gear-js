import clsx from 'clsx';
import { Props } from './Button.types';
import styles from './Button.module.scss';
import { forwardRef } from 'react';
import { ForwardedRef } from 'react';

const Button = forwardRef((props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
  const { text, icon, className, block, noWrap, type = 'button', color = 'primary', size = 'normal', ...attrs } = props;

  const buttonClassName = clsx(
    styles.button,
    className,
    styles[color],
    styles[text ? size : 'noText'],
    block && styles.block,
    noWrap && styles.noWrap,
  );

  return (
    <button type={type} className={buttonClassName} ref={ref} {...attrs}>
      {icon && <img src={icon} alt="button icon" className={styles.icon} />}
      {text}
    </button>
  );
});

// TODO: export Props as ButtonProps
export { Button, styles as buttonStyles };
