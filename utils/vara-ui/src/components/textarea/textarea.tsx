import { TextareaHTMLAttributes, ReactNode, useId, forwardRef } from 'react';
import cx from 'clsx';
import styles from './textarea.module.scss';
import type { ITextareaSizes } from './helpers.ts';

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'size'> & {
  size?: ITextareaSizes;
  label?: string;
  error?: ReactNode;
  block?: boolean;
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, label, error, size = 'default', rows = 5, placeholder = ' ', block, ...attrs }, ref) => {
    const { disabled } = attrs;

    const id = useId();

    return (
      <div className={cx(styles.root, className, disabled && styles.disabled, block && styles.block)}>
        <div className={styles.base}>
          <textarea
            rows={rows}
            id={id}
            className={cx(styles.textarea, styles[size], error && styles.error)}
            placeholder={placeholder}
            ref={ref}
            disabled={disabled}
            {...attrs}
          />

          {label && (
            <label htmlFor={id} className={cx(styles.label, styles[size])}>
              {label}
            </label>
          )}

          <fieldset className={styles.fieldset}>
            <legend className={cx(styles.legend, label && styles.legendLabel)}>{label}&#8203;</legend>
          </fieldset>
        </div>

        {error && <p className={styles.message}>{error}</p>}
      </div>
    );
  },
);

export { Textarea };
export type { Props as TextareaProps };
