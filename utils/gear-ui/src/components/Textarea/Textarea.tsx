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
    block,
    rows = 5,
    color = 'dark',
    size = 'normal',
    direction = 'x',
    onFocus,
    onBlur,
    ...attrs
  } = props;

  const { disabled, readOnly } = attrs;

  const wrapperClassName = clsx(
    styles.wrapper,
    readOnly && styles.readOnly,
    styles[color],
    styles[size],
    error && styles.error,
    block && styles.block,
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
          {...attrs}
          id={id}
          rows={rows}
          className={textareaClassName}
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
          />
        )}
      </div>
    </InputWrapper>
  );
});

export { Textarea, styles as textareaStyles };
export type { Props as TextareaProps };
