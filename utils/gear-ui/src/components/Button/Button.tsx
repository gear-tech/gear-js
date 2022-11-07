import { forwardRef, ForwardedRef } from 'react';
import clsx from 'clsx';
import { Props } from './Button.types';
import styles from './Button.module.scss';

const Button = forwardRef((props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
  const {
    text,
    icon: Icon,
    className,
    block,
    noWrap,
    noLetterSpacing,
    type = 'button',
    color = 'primary',
    size = 'medium',
    ...attrs
  } = props;

  const buttonClassName = clsx(
    styles.button,
    className,
    styles[color],
    styles[text ? size : 'noText'],
    block && styles.block,
    noWrap && styles.noWrap,
    !noLetterSpacing && styles.letterSpacing,
  );

  return (
    <button type={type} className={buttonClassName} ref={ref} {...attrs}>
      {Icon && <Icon className={styles.icon} />}
      {text}
    </button>
  );
});

export { Button, styles as buttonStyles };
export type { Props as ButtonProps };
