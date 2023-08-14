import { TextareaHTMLAttributes, ReactNode, useId } from 'react';
import cx from 'clsx';
import styles from './textarea.module.css';

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'size'> & {
  size?: 'default' | 'small';
  label?: string;
  error?: ReactNode;
};

function Textarea({ className, label, error, size = 'default', rows = 5, placeholder = ' ', ...attrs }: Props) {
  const { disabled } = attrs;

  const id = useId();

  return (
    <div className={cx(styles.root, className, disabled && styles.disabled)}>
      <div className={styles.base}>
        <textarea
          rows={rows}
          id={id}
          className={cx(styles.textarea, styles[size], error && styles.error)}
          placeholder={placeholder}
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
}

export { Textarea };
export type { Props as TextareaProps };
