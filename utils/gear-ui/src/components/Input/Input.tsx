import { InputHTMLAttributes, forwardRef, ForwardedRef, useId } from 'react';
import clsx from 'clsx';
import { InputProps, SVGComponent } from '../../types';
import { useClearButton } from '../../hooks';
import { Button } from '../Button/Button';
import { InputWrapper } from '../utils';
import { ReactComponent as SearchSVG } from './images/search.svg';
import styles from './Input.module.scss';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  InputProps & {
    icon?: SVGComponent;
  };

const Input = forwardRef((props: Props, forwardedRef: ForwardedRef<HTMLInputElement>) => {
  const {
    label,
    icon: Icon,
    className,
    error,
    gap,
    tooltip,
    type,
    block,
    size = 'normal',
    color = 'dark',
    direction = 'x',
    onBlur,
    onFocus,
    ...attrs
  } = props;

  const { readOnly, disabled } = attrs;

  const isSearch = type === 'search';

  const wrapperClassName = clsx(
    styles.wrapper,
    readOnly && styles.readOnly,
    styles[size],
    styles[color],
    error && styles.error,
    block && styles.block,
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
        {Icon && <Icon className={styles.icon} />}

        <input
          {...attrs}
          type={isSearch ? undefined : type}
          id={id}
          className={inputClassName}
          ref={inputRef}
          onFocus={(e) => {
            if (!readOnly) clearButton.show();
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            clearButton.hide();
            if (onBlur) onBlur(e);
          }}
        />

        {clearButton.isVisible && (
          <Button
            icon={clearButton.icon}
            color="transparent"
            onClick={clearButton.handleClick}
            onMouseDown={clearButton.preventBlur}
            className={styles.clearButton}
            disabled={disabled}
          />
        )}

        {isSearch && (
          <Button
            type="submit"
            icon={SearchSVG}
            color="transparent"
            className={styles.searchButton}
            disabled={disabled}
          />
        )}
      </div>
    </InputWrapper>
  );
});

export { Input, styles as inputStyles };
export type { Props as InputProps };
