import { forwardRef, TextareaHTMLAttributes, ForwardedRef, ReactNode } from 'react';
import clsx from 'clsx';
import { Gap } from '../../types';
import { useClearButton } from '../../hooks';
import { getLabelGap } from '../../utils';
import { Button } from '../Button/Button';
import styles from './Textarea.module.scss';

type BaseProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  size?: 'normal' | 'large';
  color?: 'light' | 'dark';
  error?: ReactNode;
};

type XDirectionProps = BaseProps & { label?: string; direction?: 'x'; gap?: Gap };
type YDirectionProps = BaseProps & { label?: string; direction?: 'y'; gap?: never };

type Props = XDirectionProps | YDirectionProps;

const Textarea = forwardRef((props: Props, forwardedRef: ForwardedRef<HTMLTextAreaElement>) => {
  const { label, className, error, gap, rows = 5, color = 'dark', size = 'normal', direction = 'x', ...attrs } = props;
  const { disabled } = attrs;
  const labelClassName = clsx(styles.label, className, disabled && 'disabled', label && styles[direction]);
  const textClassName = clsx(styles.text, styles[size], styles[direction]);
  const textareaWrapperClassName = clsx(styles.textareaWrapper, styles[color], styles[size], error && styles.error);
  const textareaClassName = clsx(styles.textarea, styles[color]);

  const { clearButton, inputRef } = useClearButton<HTMLTextAreaElement>(forwardedRef, color);

  return (
    <label className={labelClassName} style={gap && getLabelGap(gap)} data-testid="label">
      {label && <span className={textClassName}>{label}</span>}
      <div className={styles.wrapper}>
        <div className={textareaWrapperClassName}>
          <textarea
            rows={rows}
            className={textareaClassName}
            ref={inputRef}
            onFocus={clearButton.show}
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
    </label>
  );
});

export { Textarea, Props as TextareaProps, styles as textareaStyles };
