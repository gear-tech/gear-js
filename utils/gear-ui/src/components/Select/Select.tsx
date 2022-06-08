import { OptionHTMLAttributes, SelectHTMLAttributes, forwardRef, ForwardedRef } from 'react';
import clsx from 'clsx';
import styles from './Select.module.scss';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  options: OptionHTMLAttributes<HTMLOptionElement>[];
  label?: string;
}

const Select = forwardRef(({ options, label, className, ...attrs }: Props, ref: ForwardedRef<HTMLSelectElement>) => {
  const { disabled } = attrs;
  const labelClassName = clsx(styles.label, className, disabled && 'disabled');

  const getOptions = () => options.map((option, index) => <option key={index} {...option} />);

  return (
    <label className={labelClassName} data-testid="label">
      {label && <span className={styles.text}>{label}</span>}
      <select className={styles.select} ref={ref} {...attrs}>
        {getOptions()}
      </select>
    </label>
  );
});

export { Select, Props as SelectProps, styles as selectStyles };
