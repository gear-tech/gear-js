import { forwardRef, TextareaHTMLAttributes, ForwardedRef, useId } from 'react';
import clsx from 'clsx';
import { InputProps } from '../../types';
import { useClearButton } from '../../hooks';
import { InputWrapper } from '../utils';
import { Button } from '../Button/Button';
import styles from './Textarea.module.scss';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & InputProps;

const Textarea = forwardRef((props: Props, forwardedRef: ForwardedRef<HTMLTextAreaElement>) => {
  const {
    label,
    className,
    error,
    gap,
    tooltip,
    rows = 5,
    color = 'dark',
    size = 'normal',
    direction = 'x',
    ...attrs
  } = props;

  const { disabled, readOnly } = attrs;

  const wrapperClassName = clsx(
    styles.wrapper,
    readOnly && styles.readOnly,
    styles[color],
    styles[size],
    error && styles.error,
  );
  const textareaClassName = clsx(styles.textarea, styles[color]);

  const id = useId();
  const { clearButton, inputRef } = useClearButton<HTMLTextAreaElement>(forwardedRef, color);

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
        <textarea
          id={id}
          rows={rows}
          className={textareaClassName}
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
    </InputWrapper>
  );
});

export { Textarea, Props as TextareaProps, styles as textareaStyles };
