import React, { OptionHTMLAttributes, SelectHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Select.module.scss';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  options: OptionHTMLAttributes<HTMLOptionElement>[];
  label?: string;
}

const Select = ({ options, label, className, ...attrs }: Props) => {
  const { disabled } = attrs;
  const labelClassName = clsx(styles.label, className, disabled && 'disabled');

  const getOptions = () => options.map((option, index) => <option key={index} {...option} />);

  return (
    <label className={labelClassName} data-testid="label">
      {label && <span className={styles.text}>{label}</span>}
      <select className={styles.select} {...attrs}>
        {getOptions()}
      </select>
    </label>
  );
};

export { Select };
