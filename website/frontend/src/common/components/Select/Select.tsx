import React, { OptionHTMLAttributes, SelectHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Select.module.scss';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  options: OptionHTMLAttributes<HTMLOptionElement>[];
}

const Select = ({ options, className, ...attrs }: Props) => {
  const selectClassName = clsx(styles.select, className);

  const getOptions = () => options.map((option, index) => <option key={index} {...option} />);

  return (
    <select className={selectClassName} {...attrs}>
      {getOptions()}
    </select>
  );
};

export { Select };
