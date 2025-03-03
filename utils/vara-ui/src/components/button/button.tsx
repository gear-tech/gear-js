import cx from 'clsx';
import { ComponentPropsWithRef, FunctionComponent, ReactNode, SVGProps } from 'react';

import styles from './button.module.scss';

type BaseProps = ComponentPropsWithRef<'button'> & {
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

const Button = (props: Props) => {
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
        styles[size],
        isLoading && styles.loading,
        !text && !children && styles.noText,
        block && styles.block,
        noWrap && styles.noWrap,
        className,
      )}
      disabled={disabled || isLoading}
      {...attrs}>
      {Icon && <Icon className={styles.icon} />}
      {text && <span>{text}</span>}

      {children}
    </button>
  );
};

export { Button };
export type { Props as ButtonProps };
