import { Radio as UIRadio, RadioProps } from '@gear-js/ui';
import clsx from 'clsx';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import styles from './Radio.module.scss';

type Props<T> = Omit<RadioProps, 'name' | 'onChange' | 'onSubmit'> & {
  onSubmit: (values: T) => void;
  name: Path<T>;
  value: PathValue<T, Path<T>>;
};

const Radio = <T extends FieldValues>({ name, value, label, className, onSubmit }: Props<T>) => {
  const { register, handleSubmit } = useFormContext<T>();

  const onChange = () => handleSubmit(onSubmit)();

  return (
    <UIRadio label={label} className={clsx(styles.radio, className)} value={value} {...register(name, { onChange })} />
  );
};

export { Radio };
