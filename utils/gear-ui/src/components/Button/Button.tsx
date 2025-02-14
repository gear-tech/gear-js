import clsx from 'clsx';
import { Props } from './Button.types';
import styles from './Button.module.scss';

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

// TODO: either fix only-export-components or remove rule
// eslint-disable-next-line react-refresh/only-export-components
export { Button, styles as buttonStyles };
export type { Props as ButtonProps };
