import { CheckboxProps, checkboxStyles } from '@gear-js/ui';
import clsx from 'clsx';
import { ChangeEvent, useId } from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';

import styles from './StatusCheckbox.module.scss';

type Props<T> = Omit<CheckboxProps, 'name' | 'value' | 'onChange'> & {
  onSubmit: (values: T) => void;
  name: Path<T>;
  value: PathValue<T, Path<T>>;
  status: BulbStatus;
};

const StatusCheckbox = <T extends FieldValues>({ name, label, value, status, onSubmit }: Props<T>) => {
  const id = useId();
  const { register, setValue, handleSubmit } = useFormContext<T>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(name, event.target.value as PathValue<T, Path<T>>);
    handleSubmit(onSubmit);
  };

  const inputClasses = clsx(checkboxStyles.input, checkboxStyles.checkbox);

  return (
    <label htmlFor={id} className={checkboxStyles.label}>
      <input type="checkbox" {...register(name, { onChange: handleChange, value })} id={id} className={inputClasses} />
      <BulbBlock size="large" color="primary" status={status} text={label} className={styles.status} />
    </label>
  );
};

export { StatusCheckbox };
