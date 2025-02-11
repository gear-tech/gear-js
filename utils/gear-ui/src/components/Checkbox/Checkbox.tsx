import { ComponentPropsWithRef } from 'react';
import clsx from 'clsx';
import styles from './Checkbox.module.scss';

type Props = ComponentPropsWithRef<'input'> & {
  label: string;
  type?: 'switch';
};

const Checkbox = ({ label, className, type, ...attrs }: Props) => {
  const { disabled } = attrs;
  const labelClassName = clsx(styles.label, className, disabled && 'disabled');
  const inputClassName = clsx(styles.input, type === 'switch' ? styles.switch : styles.checkbox);

  return (
    <label className={labelClassName}>
      <input type="checkbox" className={inputClassName} {...attrs} />
      {label}
    </label>
  );
};

// TODO: either fix only-export-components or remove rule
// eslint-disable-next-line react-refresh/only-export-components
export { Checkbox, styles as checkboxStyles };
export type { Props as CheckboxProps };
