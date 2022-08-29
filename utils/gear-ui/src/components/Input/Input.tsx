import { InputHTMLAttributes, forwardRef, ForwardedRef, ReactNode, useId } from 'react';
import clsx from 'clsx';
import { getLabelGap } from '../../utils';
import { Gap } from '../../types';
import { useClearButton } from '../../hooks';
import { Button } from '../Button/Button';
import styles from './Input.module.scss';

type BaseProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  icon?: string;
  error?: ReactNode;
  size?: 'normal' | 'large';
  color?: 'dark' | 'light';
};

type XDirectionProps = BaseProps & { label?: string; direction?: 'x'; gap?: Gap };
type YDirectionProps = BaseProps & { label?: string; direction?: 'y'; gap?: never };

type Props = XDirectionProps | YDirectionProps;

const Input = forwardRef((props: Props, forwardedRef: ForwardedRef<HTMLInputElement>) => {
  const { label, icon, className, error, gap, size = 'normal', color = 'dark', direction = 'x', ...attrs } = props;

  const { readOnly, disabled } = attrs;
  const wrapperClassName = clsx(styles.wrapper, disabled && 'disabled', className, label && styles[direction]);
  const labelClassName = clsx(styles.label, styles[size], styles[direction]);
  const inputWrapperClassName = clsx(
    styles.inputWrapper,
    readOnly && styles.readOnly,
    styles[size],
    styles[color],
    error && styles.error,
  );
  const inputClassName = clsx(styles.input, styles[color]);

  const { clearButton, inputRef } = useClearButton(forwardedRef, color);
  const id = useId();

  return (
    <div className={wrapperClassName} style={gap && getLabelGap(gap)}>
      {label && (
        <label htmlFor={id} className={labelClassName} data-testid="label">
          {label}
        </label>
      )}
      <div className={styles.errorWrapper}>
        <div className={inputWrapperClassName} data-testid="wrapper">
          {icon && <img src={icon} alt="input icon" className={styles.icon} />}
          <input
            id={id}
            className={inputClassName}
            ref={inputRef}
            onFocus={readOnly ? undefined : clearButton.show}
            onBlur={clearButton.hide}
            {...attrs}
          />
          {clearButton.isVisible && (
            <Button
              icon={clearButton.icon}
              color="transparent"
              onClick={clearButton.handleClick}
              onMouseDown={clearButton.preventBlur}
              className={styles.clearButton}
            />
          )}
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
});

export { Input, Props as InputProps, styles as inputStyles };
