import { CheckboxProps, checkboxStyles } from '@gear-js/ui';
import clsx from 'clsx';
import { useId } from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';

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

  return (
    <label htmlFor={id} className={checkboxStyles.label}>
      <input
        type="checkbox"
        id={id}
        value={value}
        className={clsx(checkboxStyles.input, checkboxStyles.checkbox)}
        {...register(name, { onChange })}
      />

      <BulbBlock size="large" color="primary" weight="normal" status={status} text={label} />
    </label>
  );
};

export { StatusCheckbox };
