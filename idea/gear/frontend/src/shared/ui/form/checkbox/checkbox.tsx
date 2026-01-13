import { Checkbox as GearCheckbox, CheckboxProps } from '@gear-js/ui';
import { useFormContext } from 'react-hook-form';

type Props = CheckboxProps & {
  name: string;
};

function Checkbox({ name, onChange, onBlur, ...props }: Props) {
  const { register } = useFormContext();

  return <GearCheckbox {...props} {...register(name, { onChange, onBlur })} />;
}

export { Checkbox };
