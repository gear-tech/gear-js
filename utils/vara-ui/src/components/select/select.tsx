import { SelectHTMLAttributes, OptionHTMLAttributes, ReactNode, useId } from 'react';
import cx from 'clsx';
import styles from './select.module.css';

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'placeholder' | 'id'> & {
  options: OptionHTMLAttributes<HTMLOptionElement>[];
  label?: string;
  error?: ReactNode;
};

function Select({ options, className, label, error, ...attrs }: Props) {
  const id = useId();

  const getOptions = () => options.map((option, index) => <option key={index} {...option} />);

  return (
    <div className={className}>
      <div className={styles.base}>
        <select id={id} className={cx(styles.select, error && styles.error)} {...attrs}>
          {getOptions()}
        </select>

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

export { Select };
export type { Props as SelectProps };
