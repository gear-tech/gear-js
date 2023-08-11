import { TextareaHTMLAttributes, ReactNode, useId } from 'react';
import cx from 'clsx';
import styles from './textarea.module.css';

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'id'> & {
  label?: string;
  error?: ReactNode;
};

function Textarea({ className, label, error, rows = 5, ...attrs }: Props) {
  const id = useId();

  return (
    <div className={className}>
      <div className={styles.base}>
        <textarea
          rows={rows}
          id={id}
          className={cx(styles.textarea, error && styles.error)}
          placeholder=" "
          {...attrs}
        />

        {label && (
          <label htmlFor={id} className={styles.label}>
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
