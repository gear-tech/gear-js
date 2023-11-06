import { ChangeEvent } from 'react';
import clsx from 'clsx';
import { Radio as UIRadio, RadioProps } from '@gear-js/ui';

import styles from './Radio.module.scss';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

type Props<T> = Omit<RadioProps, 'name' | 'onChange' | 'onSubmit'> & {
  onSubmit: (values: T) => void;
  name: Path<T>;
  value: PathValue<T, Path<T>>;
};

const Radio = <T extends FieldValues>({ name, value, label, className, onSubmit }: Props<T>) => {
  const { register, handleSubmit, setValue } = useFormContext<T>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(name, event.target.value as PathValue<T, Path<T>>);
    handleSubmit(onSubmit);
  };

  return (
    <UIRadio
      {...register(name, { onChange: handleChange, value })}
      label={label}
      className={clsx(styles.radio, className)}
    />
  );
};

export { Radio };
