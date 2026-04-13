import { clsx } from 'clsx';
import { type ComponentPropsWithRef, useId } from 'react';

import { useClearButton } from '../../hooks';
import type { InputProps } from '../../types';
import { Button } from '../Button/Button';
import { InputWrapper } from '../utils';

import styles from './Textarea.module.scss';

type Props = ComponentPropsWithRef<'textarea'> & InputProps;

const Textarea = (props: Props) => {
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
    ref: forwardedRef,
    ...attrs
  } = props;

  const { disabled, readOnly } = attrs;

  const wrapperClassName = clsx(
    styles.wrapper,
    readOnly && styles.readOnly,
    styles[color],
    styles[size],
    Boolean(error) && styles.error,
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
            disabled={disabled}
          />
        )}
      </div>
    </InputWrapper>
  );
};

export type { Props as TextareaProps };
export { styles as textareaStyles, Textarea };
