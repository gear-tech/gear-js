import { SelectHTMLAttributes, OptionHTMLAttributes, ReactNode, useId } from 'react';
import cx from 'clsx';
import styles from './select.module.css';

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'size'> & {
  options: OptionHTMLAttributes<HTMLOptionElement>[];
  size?: 'default' | 'small';
  label?: string;
  error?: ReactNode;
};

function Select({ options, className, label, error, size = 'default', ...attrs }: Props) {
  const id = useId();

  const getOptions = () => options.map((option, index) => <option key={index} {...option} />);

  return (
    <div className={className}>
      <div className={styles.base}>
        <select id={id} className={cx(styles.select, styles[size], error && styles.error)} {...attrs}>
          {getOptions()}
        </select>

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

export { Select };
export type { Props as SelectProps };
