import React, { OptionHTMLAttributes, SelectHTMLAttributes } from 'react';
import styles from './Select.module.scss';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  options: OptionHTMLAttributes<HTMLOptionElement>[];
}

const Select = ({ options, ...attrs }: Props) => {
  const getOptions = () => options.map((option, index) => <option key={index} {...option} />);

  return <select {...attrs}>{getOptions()}</select>;
};

export { Select };
