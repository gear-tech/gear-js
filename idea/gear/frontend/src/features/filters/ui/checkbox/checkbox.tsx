import { CheckboxProps } from '@gear-js/ui';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { Checkbox as FormCheckbox } from '@/shared/ui';

type Props<T> = Omit<CheckboxProps, 'name' | 'value' | 'onChange' | 'onSubmit'> & {
  onSubmit: (values: T) => void;
  name: Path<T>;
  value: PathValue<T, Path<T>>;
};

const Checkbox = <T extends FieldValues>({ onSubmit, ...props }: Props<T>) => {
  const { handleSubmit } = useFormContext<T>();

  const onChange = () => handleSubmit(onSubmit)();

  return <FormCheckbox onChange={onChange} {...props} />;
};

export { Checkbox };
