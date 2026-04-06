import { type RadioProps, radioStyles } from '@gear-js/ui';
import { clsx } from 'clsx';
import { type FieldValues, type Path, type PathValue, useFormContext } from 'react-hook-form';

import { BulbBlock, type BulbStatus } from '@/shared/ui/bulbBlock';

type Props<T> = Omit<RadioProps, 'name' | 'value' | 'onChange' | 'onSubmit'> & {
  onSubmit: (values: T) => void;
  name: Path<T>;
  value: PathValue<T, Path<T>>;
  status: BulbStatus;
};

const StatusRadio = <T extends FieldValues>({ name, label, value, status, onSubmit }: Props<T>) => {
  const { register, handleSubmit } = useFormContext<T>();

  const onChange = () => handleSubmit(onSubmit)();

  return (
    <label className={radioStyles.label}>
      <input
        type="radio"
        value={value}
        className={clsx(radioStyles.input, radioStyles.radio)}
        {...register(name, { onChange })}
      />

      <BulbBlock size="large" color="primary" weight="normal" status={status} text={label} />
    </label>
  );
};

export { StatusRadio };
