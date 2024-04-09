import { CheckboxProps, checkboxStyles } from '@gear-js/ui';
import clsx from 'clsx';
import { useId } from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';

import styles from './StatusCheckbox.module.scss';

type Props<T> = Omit<CheckboxProps, 'name' | 'value' | 'onChange' | 'onSubmit'> & {
  onSubmit: (values: T) => void;
  name: Path<T>;
  value: PathValue<T, Path<T>>;
  status: BulbStatus;
};

const StatusCheckbox = <T extends FieldValues>({ name, label, value, status, onSubmit }: Props<T>) => {
  const id = useId();
  const { register, handleSubmit } = useFormContext<T>();

  const onChange = () => handleSubmit(onSubmit)();

  const inputClasses = clsx(checkboxStyles.input, checkboxStyles.checkbox);

  return (
    <label htmlFor={id} className={checkboxStyles.label}>
      <input type="checkbox" id={id} value={value} className={inputClasses} {...register(name, { onChange })} />
      <BulbBlock size="large" color="primary" status={status} text={label} className={styles.status} />
    </label>
  );
};

export { StatusCheckbox };
