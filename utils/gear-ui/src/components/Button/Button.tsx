import { clsx } from 'clsx';

import styles from './Button.module.scss';
import type { Props } from './Button.types';

const Button = (props: Props) => {
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
    <button type={type} className={buttonClassName} {...attrs}>
      {Icon && <Icon className={styles.icon} />}
      {text}
    </button>
  );
};

export type { Props as ButtonProps };
export { Button, styles as buttonStyles };
