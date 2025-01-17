import { ButtonHTMLAttributes, FunctionComponent, ReactNode, SVGProps, forwardRef } from 'react';
import cx from 'clsx';

import styles from './button.module.scss';

type BaseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  icon?: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  color?: 'primary' | 'plain' | 'contrast' | 'grey' | 'border' | 'transparent' | 'danger';
  size?: 'x-small' | 'small' | 'medium' | 'default' | 'x-large';
  isLoading?: boolean;
  block?: boolean;
  noWrap?: boolean;
};

type TextProps = BaseProps & {
  text: string;
  children?: never;
};

type IconProps = BaseProps & {
  icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  children?: never;
};

type ChildrenProps = BaseProps & {
  children: ReactNode;
  text?: never;
  icon?: never;
};

type Props = TextProps | IconProps | ChildrenProps;

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const {
    className,
    text,
    icon: Icon,
    disabled,
    isLoading,
    type = 'button',
    color = 'primary',
    size = 'default',
    children,
    block,
    noWrap,
    ...attrs
  } = props;

  return (
    <button
      type={type}
      className={cx(
        styles.button,
        styles[color],
        color !== 'transparent' && styles[size],
        isLoading && styles.loading,
        !text && !children && styles.noText,
        block && styles.block,
        noWrap && styles.noWrap,
        className,
      )}
      disabled={disabled || isLoading}
      ref={ref}
      {...attrs}>
      {Icon && <Icon className={styles.icon} />}
      {(text || children) && <span className={styles.content}>{text || children}</span>}
    </button>
  );
});

export { Button };
export type { Props as ButtonProps };
