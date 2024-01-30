import { Checkbox as GearCheckbox, CheckboxProps } from '@gear-js/ui';
import { useFormContext } from 'react-hook-form';

type Props = Omit<CheckboxProps, 'onChange' | 'onBlur'> & {
  name: string;
};

function Checkbox({ name, ...props }: Props) {
  const { register } = useFormContext();

  return <GearCheckbox {...props} {...register(name)} />;
}

export { Checkbox };
