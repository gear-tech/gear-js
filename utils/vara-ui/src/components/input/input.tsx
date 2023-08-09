import { InputHTMLAttributes, ReactNode, useId } from 'react';
import cx from 'clsx';
import styles from './input.module.css';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> & {
  label?: string;
  error?: ReactNode;
};

function Input({ className, label, error, ...attrs }: Props) {
  const id = useId();

  return (
    <div className={className}>
      <div className={styles.base}>
        <input type="text" id={id} className={cx(styles.input, error && styles.error)} placeholder=" " {...attrs} />

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

export { Input };
export type { Props };
