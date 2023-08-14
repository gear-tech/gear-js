import { ButtonHTMLAttributes, FunctionComponent, SVGProps, forwardRef } from 'react';
import cx from 'clsx';
import styles from './button.module.css';

type BaseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  icon?: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  color?: 'primary' | 'dark' | 'light' | 'border' | 'transparent';
  size?: 'default' | 'small';
  isLoading?: boolean;
};

type TextProps = BaseProps & {
  text: string;
};

type IconProps = BaseProps & {
  icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
};

// TODO: omit text and icon if children specified?
type Props = TextProps | IconProps;

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
    ...attrs
  } = props;

  return (
    <button
      type={type}
      className={cx(
        styles.button,
        styles[color],
        color !== 'transparent' && styles[size],
        disabled && styles.disabled,
        isLoading && styles.loading,
        !text && styles.noText,
        className,
      )}
      disabled={disabled || isLoading}
      ref={ref}
      {...attrs}>
      {Icon && <Icon />}
      {text && <span>{text}</span>}

      {children}
    </button>
  );
});

export { Button };
export type { Props as ButtonProps };
