import { Radio as UIRadio, RadioProps } from '@gear-js/ui';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

type Props<T> = Omit<RadioProps, 'name' | 'value' | 'onChange' | 'onSubmit'> & {
  onSubmit: (values: T) => void;
  name: Path<T>;
  value: PathValue<T, Path<T>>;
};

const Radio = <T extends FieldValues>({ name, value, label, className, onSubmit }: Props<T>) => {
  const { register, handleSubmit } = useFormContext<T>();

  const onChange = () => handleSubmit(onSubmit)();

  return <UIRadio label={label} className={className} value={value} {...register(name, { onChange })} />;
};

export { Radio };
