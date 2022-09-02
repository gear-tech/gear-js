import { InputHTMLAttributes, forwardRef, ForwardedRef, useId } from 'react';
import clsx from 'clsx';
import { InputProps } from '../../types';
import { useClearButton } from '../../hooks';
import { Button } from '../Button/Button';
import { InputWrapper } from '../utils';
import search from './images/search.svg';
import styles from './Input.module.scss';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  InputProps & {
    icon?: string;
  };

const Input = forwardRef((props: Props, forwardedRef: ForwardedRef<HTMLInputElement>) => {
  const {
    label,
    icon,
    className,
    error,
    gap,
    tooltip,
    size = 'normal',
    color = 'dark',
    direction = 'x',
    ...attrs
  } = props;

  const { readOnly, disabled, type } = attrs;

  const isSearch = type === 'search';

  const wrapperClassName = clsx(
    styles.wrapper,
    readOnly && styles.readOnly,
    styles[size],
    styles[color],
    error && styles.error,
  );
  const inputClassName = clsx(styles.input, styles[color]);

  const { clearButton, inputRef } = useClearButton(forwardedRef, color);
  const id = useId();

  return (
    <InputWrapper
      id={id}
      className={className}
      label={label}
      error={error}
      direction={direction}
      size={size}
      gap={gap}
      disabled={disabled}
      tooltip={tooltip}>
      <div className={wrapperClassName} data-testid="wrapper">
        {icon && <img src={icon} alt="input icon" className={styles.icon} />}
        <input
          type={type}
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
        {isSearch && <Button type="submit" icon={search} color="transparent" className={styles.searchButton} />}
      </div>
    </InputWrapper>
  );
});

export { Input, Props as InputProps, styles as inputStyles };
